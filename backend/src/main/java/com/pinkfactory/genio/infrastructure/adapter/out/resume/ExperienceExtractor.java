package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
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
public class ExperienceExtractor implements NodeAction<State> {

    public static final String NAME = "Experience Extractor";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/experience-extractor.md");

    private final SseEmitterRegistry registry;

    @Override
    public Map<String, Object> apply(State state) {

        var feedback = state.evaluations().stream()
                .filter(evaluation -> evaluation.field().equals("experience"))
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
                                    .message("주요 경험을 다시 정리하고 있어요.")
                                    .build()));
        } else {

            state.<String>value("resumeId")
                    .ifPresent(resumeId -> registry.send(
                            resumeId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("주요 경험을 정리하고 있어요.")
                                    .build()));
        }

        try {
            var output = model.chat(
                    template.apply(Map.of("feedback", feedback)).toAiMessage(),
                    PromptTemplate.of("사용자의 이력서는 다음과 같습니다:\n{{resume}}")
                            .apply(Map.of(
                                    "resume", state.<String>value("resume").orElse("")))
                            .toUserMessage(),
                    AiMessage.from(
                            """
                    생각: 사용자의 이력서에 대한 분석이 끝났다. 사용자를 가장 돋보일 수 있는 5개의 프로젝트를 주어진 형식에 맞춰 최신순으로 추출해야 겠다.
                    추출 결과:
                    """));

            log.info(
                    "[{}][{}]\n{}",
                    state.<String>value("resumeId").orElse("Unknown"),
                    NAME,
                    output.aiMessage().text());

            return Map.of("experience", output.aiMessage().text());
        } catch (Exception e) {

            log.error("[{}][{}] {}", state.<String>value("resumeId").orElse("Unknown"), NAME, e.getMessage());

            throw e;
        }
    }
}
