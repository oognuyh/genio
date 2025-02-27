package com.pinkfactory.genio.infrastructure.adapter.out;

import com.pinkfactory.genio.port.out.TokenEstimator;
import dev.langchain4j.model.Tokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClovaTokenEstimator implements TokenEstimator {

    private final Tokenizer tokenizer;

    @Override
    public int estimate(String content) {

        return tokenizer.estimateTokenCountInText(content);
    }
}
