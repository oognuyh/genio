package com.pinkfactory.genio.infrastructure.langchain4j;

import java.util.List;
import lombok.Builder;
import lombok.Value;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Value
@Builder
public class HyperClovaXChatCompletionRequest {

    private List<HyperClovaXMessage> messages;

    private Integer maxTokens;

    private Double temperature;

    private Double repeatPenalty;

    private Double topP;

    private Integer topK;

    private List<String> stopBefore;

    private Integer seed;
}
