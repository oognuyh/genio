package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import com.fasterxml.jackson.core.type.TypeReference;
import com.pinkfactory.genio.domain.JobCategory;
import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.port.in.FindJobCategoriesUseCase;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bsc.langgraph4j.action.NodeAction;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SkillSetExtractor implements NodeAction<State> {

    public static final String NAME = "Skill set extractor";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/skill-set-extractor.md");

    private final SseEmitterRegistry registry;

    private final FindJobCategoriesUseCase findJobCategoriesUseCase;

    @Override
    public Map<String, Object> apply(State state) {

        var feedback = state.evaluations().stream()
                .filter(evaluation -> evaluation.field().equals("skillSet"))
                .filter(Evaluation::shouldRevise)
                .findFirst()
                .map(Evaluation::feedback)
                .orElse("");

        if (StringUtils.hasText(feedback)) {

            state.<String>value("resumeId")
                    .ifPresent(resumeId -> registry.send(
                            resumeId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("보유한 스킬을 다시 분석하고 있어요.")
                                    .build()));
        } else {

            state.<String>value("resumeId")
                    .ifPresent(resumeId -> registry.send(
                            resumeId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("보유한 스킬을 분석하고 있어요.")
                                    .build()));
        }

        var output = model.chat(
                template.apply(Map.of(
                                "candidates",
                                findJobCategoriesUseCase.findJobCategories().stream()
                                        .map(JobCategory::skillSet)
                                        .flatMap(List::stream)
                                        .toList(),
                                "feedback",
                                feedback))
                        .toAiMessage(),
                PromptTemplate.of("사용자의 이력서는 다음과 같습니다:\n{{resume}}")
                        .apply(Map.of("resume", state.<String>value("resume").orElse("")))
                        .toUserMessage(),
                AiMessage.from("""
                추출 결과:
                """));

        log.info(
                "[{}] 스킬셋: {}",
                state.<String>value("resumeId").orElse("Unknown"),
                output.aiMessage().text());

        return Map.of(
                "skillSet",
                JsonUtil.deserialize(
                        JsonUtil.repairJson(output.aiMessage().text()), new TypeReference<List<String>>() {}));
    }
}
