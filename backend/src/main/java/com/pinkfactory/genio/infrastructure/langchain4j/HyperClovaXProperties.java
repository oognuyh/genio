package com.pinkfactory.genio.infrastructure.langchain4j;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Data
@ConfigurationProperties(prefix = "hyper-clova-x")
public class HyperClovaXProperties {

    @NotNull private String apiKey;

    @NotNull private String baseUrl;

    private String modelName = "HCX-DASH-001";

    private Integer maxTokens = 256;

    private Double temperature = 0.5;

    private Double repeatPenalty = 5.0;

    private Double topP = 0.8;

    private Integer topK = 0;

    private List<String> stopBefore = new ArrayList<>();

    private Integer seed = 0;
}
