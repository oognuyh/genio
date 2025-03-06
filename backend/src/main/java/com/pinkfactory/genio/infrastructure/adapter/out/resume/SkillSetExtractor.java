package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import com.fasterxml.jackson.core.type.TypeReference;
import com.pinkfactory.genio.domain.JobCategory;
import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.SseEmitterRegistry;
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

        try {

            var position = state.<String>value("position").orElse("Unknown");

            var output = model.chat(
                    template.apply(Map.of(
                                    "candidates",
                                    findJobCategoriesUseCase.findJobCategories().stream()
                                            .filter(category ->
                                                    category.positions().contains(position))
                                            .map(JobCategory::skillSet)
                                            .flatMap(List::stream)
                                            .toList(),
                                    "feedback",
                                    feedback))
                            .toAiMessage(),
                    PromptTemplate.of("사용자의 이력서는 다음과 같습니다:\n{{resume}}")
                            .apply(Map.of(
                                    "resume", state.<String>value("resume").orElse("")))
                            .toUserMessage(),
                    AiMessage.from(
                            """
                생각: 주어진 스킬셋 목록 중에서 사용자가 사용한 스킬을 선택해서 형식에 맞춰 반환해야 겠다.
                추출 결과:
                """));

            log.info(
                    "[{}][{}]\n{}",
                    state.<String>value("resumeId").orElse("Unknown"),
                    NAME,
                    output.aiMessage().text());

            return Map.of(
                    "skillSet",
                    JsonUtil.deserialize(
                            JsonUtil.repairJson(output.aiMessage().text()), new TypeReference<List<String>>() {}));
        } catch (Exception e) {

            log.error("[{}][{}] {}", state.<String>value("resumeId").orElse("Unknown"), NAME, e.getMessage());

            throw e;
        }
    }
}
