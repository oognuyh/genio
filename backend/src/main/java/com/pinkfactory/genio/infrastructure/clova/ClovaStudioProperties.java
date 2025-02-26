package com.pinkfactory.genio.infrastructure.clova;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@ConfigurationProperties(prefix = "clova.studio")
public record ClovaStudioProperties(
        @NotNull String apiKey,
        @NotNull String baseUrl,
        String modelName,
        Integer maxTokens,
        Double temperature,
        Double repeatPenalty,
        Double topP,
        Integer topK,
        List<String> stopBefore,
        Integer seed) {

    public ClovaStudioProperties {

        modelName = Objects.requireNonNullElse(modelName, "HCX-003");
        maxTokens = Objects.requireNonNullElse(maxTokens, 256);
        temperature = Objects.requireNonNullElse(temperature, 0.5);
        repeatPenalty = Objects.requireNonNullElse(repeatPenalty, 5.0);
        topP = Objects.requireNonNullElse(topP, 0.8);
        topK = Objects.requireNonNullElse(topK, 0);
        stopBefore = Objects.requireNonNullElse(stopBefore, new ArrayList<>());
        seed = Objects.requireNonNullElse(seed, 0);
    }
}
