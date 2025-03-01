package com.pinkfactory.genio.infrastructure.adapter.out.card;

import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph.State;
import com.pinkfactory.genio.infrastructure.langchain4j.PromptTemplate;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
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
public class TaglineGenerator implements NodeAction<State> {

    public static final String NAME = "Tagline generator";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/tagline-generator.md");

    private final SseEmitterRegistry registry;

    @Override
    public Map<String, Object> apply(State state) {

        state.<String>value("cardId")
                .ifPresent(cardId -> registry.send(
                        cardId,
                        Event.builder()
                                .type(EventType.RUNNING)
                                .message("슬로건을 만들고 있어요.")
                                .build()));

        var output = model.chat(
                template.apply(state).toSystemMessage(),
                PromptTemplate.of(
                                """
            사용자의 정보는 다음과 같습니다:

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
            생각: "{{ resume.tone.title }} - {{ resume.tone.description }}"에 맞춰 생성해야 겠다. 그리고 반드시 15자 이내로 생성하자.
            생성 결과:
            """)
                        .apply(Map.of("resume", state.resume()))
                        .toAiMessage());

        log.info(
                "[{}] 태그라인: {}",
                state.<String>value("cardId").orElse("Unknown"),
                output.aiMessage().text());

        return Map.of("tagline", output.aiMessage().text());
    }
}
