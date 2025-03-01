package com.pinkfactory.genio.infrastructure.adapter.out.card;

import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
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
public class ColorGenerator implements NodeAction<State> {

    public static final String NAME = "Color generator";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/color-generator.md");

    private final SseEmitterRegistry registry;

    @Override
    public Map<String, Object> apply(State state) {

        state.<String>value("cardId")
                .ifPresent(cardId -> registry.send(
                        cardId,
                        Event.builder()
                                .type(EventType.RUNNING)
                                .message("어울리는 컬러 팔레트를 구성하고 있어요.")
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
                        생각: "{{ resume.tone.title }} - {{ resume.tone.description }}"에 맞춰 생성해야 겠다. 또한, 어울리는 색상 5개를 형식에 맞춰 생성해야 겠다.
                        생성 결과:
                        """)
                        .apply(Map.of("resume", state.resume()))
                        .toAiMessage());

        log.info(
                "[{}] 컬러: {}",
                state.<String>value("cardId").orElse("Unknown"),
                output.aiMessage().text());

        return Map.of("colors", JsonUtil.repairJson(output.aiMessage().text()));
    }
}
