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
import org.bsc.langgraph4j.action.NodeAction;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@RequiredArgsConstructor
public class HashtagGenerator implements NodeAction<State> {

    public static final String NAME = "Hashtag generator";

    private final ChatLanguageModel model;

    private final PromptTemplate template = PromptTemplate.of("classpath:prompts/hashtag-generator.md");

    private final SseEmitterRegistry registry;

    @Override
    public Map<String, Object> apply(State state) {

        var feedback = state.evaluations().stream()
                .filter(evaluation -> evaluation.field().equals("hashtags"))
                .filter(Evaluation::shouldRevise)
                .findFirst()
                .map(Evaluation::feedback)
                .orElse("");

        if (StringUtils.hasText(feedback)) {

            state.<String>value("cardId")
                    .ifPresent(cardId -> registry.send(
                            cardId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("해시태그를 다시 생성하고 있어요.")
                                    .build()));
        } else {

            state.<String>value("cardId")
                    .ifPresent(cardId -> registry.send(
                            cardId,
                            Event.builder()
                                    .type(EventType.RUNNING)
                                    .message("해시태그를 생성하고 있어요.")
                                    .build()));
        }

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
                        .apply(Map.of("resume", state.resume(), "feedback", feedback))
                        .toUserMessage(),
                PromptTemplate.of(
                                """
                        "{{ resume.tone.title }} - {{ resume.tone.description }}"에 맞춰 생성한다.

                        생성 결과:
                        """)
                        .apply(Map.of("resume", state.resume()))
                        .toAiMessage());

        return Map.of("hashtags", JsonUtil.repairJson(output.aiMessage().text()));
    }
}
