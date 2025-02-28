package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.bsc.langgraph4j.action.NodeAction;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@RequiredArgsConstructor
public class ResumeEvaluator implements NodeAction<State> {

    public static final String NAME = "Evaluator";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/resume-evaluator.md");

    private final SseEmitterRegistry registry;

    @Override
    public Map<String, Object> apply(State state) {

        var iterations = state.iterations();


        state.<String>value("resumeId")
            .ifPresent(resumeId -> registry.send(
                resumeId,
                Event.builder()
                    .type(EventType.RUNNING)
                    .message("분석된 내용을 평가하고 있어요.")
                    .build()));

        var output = model.chat(
                template.apply(state).toAiMessage(),
                PromptTemplate.of("사용자의 이력서는 다음과 같습니다:\n{{resume}}")
                        .apply(Map.of("resume", state.<String>value("resume").orElse("")))
                        .toUserMessage(),
                AiMessage.from("""
                평가 결과:
                """));

        return Map.of("evaluations", JsonUtil.repairJson(output.aiMessage().text()), "iterations", iterations + 1);
    }
}
