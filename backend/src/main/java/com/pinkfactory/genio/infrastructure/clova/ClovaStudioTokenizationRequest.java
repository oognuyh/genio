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
public class ClovaStudioTokenizationRequest {

    private List<ClovaStudioMessage> messages;
}
