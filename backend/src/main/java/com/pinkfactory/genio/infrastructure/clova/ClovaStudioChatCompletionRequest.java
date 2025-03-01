package com.pinkfactory.genio.infrastructure.clova;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Builder
@Jacksonized
public class ClovaStudioChatCompletionRequest {

    private List<ClovaStudioMessage> messages;

    private Integer maxTokens;

    private Double temperature;

    private Double repeatPenalty;

    private Double topP;

    private Integer topK;

    private List<String> stopBefore;

    private Integer seed;
}
