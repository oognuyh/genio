package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import com.fasterxml.jackson.core.type.TypeReference;
import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.port.in.FindJobCategoriesUseCase;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
public class PersonalInformationExtractor implements NodeAction<State> {

    public static final String NAME = "Personal information extractor";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/personal-information-extractor.md");

    private final SseEmitterRegistry registry;

    private final FindJobCategoriesUseCase findJobCategoriesUseCase;

    @Override
    public Map<String, Object> apply(State state) {

        var feedback = state.evaluations().stream()
                .filter(evaluation ->
                        List.of("name", "jobCategory", "stage", "position").contains(evaluation.field()))
                .filter(Evaluation::shouldRevise)
                .map(Evaluation::feedback)
                .collect(Collectors.joining("\n"));

        if (StringUtils.hasText(feedback)) {

            state.<String>value("resumeId")
                    .ifPresent(resumeId -> registry.send(
                            resumeId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("이름과 직군 정보를 다시 정리하는 중이에요.")
                                    .build()));
        } else {

            state.<String>value("resumeId")
                    .ifPresent(resumeId -> registry.send(
                            resumeId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("이름과 직군 정보를 정리하는 중이에요.")
                                    .build()));
        }

        try {

            var output = model.chat(
                    template.apply(Map.of(
                                    "jobCategories",
                                    findJobCategoriesUseCase.findJobCategories(),
                                    "now",
                                    ZonedDateTime.now(ZoneId.of("Asia/Seoul")),
                                    "feedback",
                                    feedback))
                            .toSystemMessage(),
                    PromptTemplate.of("사용자의 이력서는 다음과 같습니다:\n{{resume}}")
                            .apply(Map.of(
                                    "resume", state.<String>value("resume").orElse("")))
                            .toUserMessage(),
                    AiMessage.from("""
                추출 결과:
                """));

            log.info(
                    "[{}][{}]\n{}",
                    state.<String>value("resumeId").orElse("Unknown"),
                    NAME,
                    output.aiMessage().text());

            return JsonUtil.deserialize(JsonUtil.repairJson(output.aiMessage().text()), new TypeReference<>() {});
        } catch (Exception e) {

            log.error("[{}][{}] {}", state.<String>value("resumeId").orElse("Unknown"), NAME, e.getMessage());

            throw e;
        }
    }
}
