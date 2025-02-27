package com.pinkfactory.genio.infrastructure.adapter.out;

import com.fasterxml.jackson.core.type.TypeReference;
import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.domain.Tone;
import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph;
import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph.State;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.port.out.CardGenerator;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LangGraph4jCardGenerator implements CardGenerator {

    private final CardGeneratingGraph graph;

    @Override
    public Card generate(String cardId, Resume resume, Tone tone) {

        var result = graph.build().stream(Map.of("cardId", cardId, "resume", JsonUtil.serialize(resume)));

        State generation = new State(Map.of());

        for (var r : result) {

            generation = r.state();
        }

        return Card.builder()
                .cardId(IDGenerator.generate())
                .tagline(generation
                        .<String>value("tagline")
                        .map(name -> name.replace("null", ""))
                        .orElse(""))
                .biography(generation
                        .<String>value("biography")
                        .map(name -> name.replace("null", ""))
                        .orElse(""))
                .hashtags(JsonUtil.deserialize(
                        generation.<String>value("hashtags").orElse("[]"), new TypeReference<>() {}))
                .colors(JsonUtil.deserialize(generation.<String>value("colors").orElse("[]"), new TypeReference<>() {}))
                .build();
    }
}
