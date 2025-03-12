package com.pinkfactory.genio.infrastructure.adapter.out;

import com.fasterxml.jackson.core.type.TypeReference;
import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Recommended;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.domain.Tone;
import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph;
import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph.State;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.port.out.CardGenerator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.CompletionException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LangGraph4jCardGenerator implements CardGenerator {

    private final CardGeneratingGraph graph;

    private static final String HEX_CHARACTERS = "0123456789ABCDEF";

    private final Random random = new Random();

    @SneakyThrows
    @Override
    public Card generate(String cardId, Resume resume, Tone tone) {

        var result = graph.build().stream(Map.of("cardId", cardId, "resume", JsonUtil.serialize(resume)));

        State generation = new State(new HashMap<>());

        try {
            for (var r : result) {

                generation = r.state();
            }
        } catch (CompletionException e) {

            throw e.getCause().getCause();
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
                .colors(JsonUtil.deserialize(
                                generation.<String>value("colors").orElse("[]"),
                                new TypeReference<List<Recommended<String>>>() {})
                        .stream()
                        .map(recommended -> {
                            var hex = recommended.value().replaceAll("\\s+", "");

                            if (!hex.startsWith("#")) {

                                hex = "#" + hex;
                            }

                            if (hex.length() < 7) {

                                var sb = new StringBuilder(hex);

                                while (sb.length() < 7) {
                                    sb.append(HEX_CHARACTERS.charAt(random.nextInt(hex.length())));
                                }

                                hex = sb.toString();
                            } else if (hex.length() > 7) {

                                hex = hex.substring(0, 7);
                            }

                            return recommended.toBuilder().value(hex).build();
                        })
                        .toList())
                .build();
    }
}
