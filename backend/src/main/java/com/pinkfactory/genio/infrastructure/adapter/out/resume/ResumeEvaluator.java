package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.WebSocketSessionRegistry;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bsc.langgraph4j.action.NodeAction;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ResumeEvaluator implements NodeAction<State> {

    public static final String NAME = "Evaluator";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/resume-evaluator.md");

    private final WebSocketSessionRegistry registry;

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

        try {

            var output = model.chat(
                    template.apply(state).toAiMessage(),
                    PromptTemplate.of(
                                    """
                추출된 사용자의 이력서는 다음과 같습니다:
                이름: {{ name }}
                직군: {{ jobCategory }}
                포지션: {{ position }}
                경력사항:
                {{ experience }}
                """)
                            .apply(Map.of(
                                    "name",
                                    state.<String>value("name").orElse(""),
                                    "jobCategory",
                                    state.<String>value("jobCategory").orElse(""),
                                    "position",
                                    state.<String>value("position").orElse(""),
                                    "experience",
                                    state.<String>value("experience").orElse("")))
                            .toUserMessage(),
                    AiMessage.from("""
                평가 결과:
                """));

            log.info(
                    "[{}] 평가:\n{}",
                    state.<String>value("resumeId").orElse("Unknown"),
                    output.aiMessage().text());

            return Map.of("evaluations", JsonUtil.repairJson(output.aiMessage().text()), "iterations", iterations + 1);
        } catch (Exception e) {

            log.error("[{}][{}] {}", state.<String>value("resumeId").orElse("Unknown"), NAME, e.getMessage());

            throw e;
        }
    }
}
