package com.pinkfactory.genio.infrastructure.adapter.out.card;

import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.WebSocketSessionRegistry;
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
public class BiographyGenerator implements NodeAction<State> {

    public static final String NAME = "Biography generator";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/biography-generator.md");

    private final WebSocketSessionRegistry registry;

    @Override
    public Map<String, Object> apply(State state) {

        state.<String>value("cardId")
                .ifPresent(cardId -> registry.send(
                        cardId,
                        Event.builder()
                                .type(EventType.RUNNING)
                                .message("간단한 자기소개를 정리하고 있어요.")
                                .build()));

        var output = model.chat(
                template.apply(state).toSystemMessage(),
                PromptTemplate.of(
                                """
                        사용자의 정보는 다음과 같습니다:

                        이름: {{ resume.name }}
                        직군: {{ resume.jobCategory }}
                        경력: {{ resume.stage }}
                        포지션: {{ resume.position }}
                        강점:
                        {{ #resume.strengths }}  - {{ value }}{{ /resume.strengths }}
                        스킬셋: {{ #resume.skillSet }}{{^-first}}, {{/-first}}{{ this }}{{ /resume.skillSet }}
                        경험:
                        {{ resume.experience }}
                        """)
                        .apply(Map.of("resume", state.resume()))
                        .toUserMessage(),
                PromptTemplate.of(
                                """
                        "생각: 사용자가 선택한 {{ resume.tone.title }} - {{ resume.tone.description }}" 톤에 맞춰 생성한다. 또한, 요구 사항을 모두 고려하고 핵심만 간결한 **2~3문장** 내로 총 글자 수는 100자 이내가 되게 반드시 생성해야 겠다.
                        생성 결과:
                        """)
                        .apply(Map.of("resume", state.resume()))
                        .toAiMessage());

        log.info(
                "[{}] 바이오그래피: {}",
                state.<String>value("cardId").orElse("Unknown"),
                output.aiMessage().text());

        return Map.of("biography", output.aiMessage().text());
    }
}
