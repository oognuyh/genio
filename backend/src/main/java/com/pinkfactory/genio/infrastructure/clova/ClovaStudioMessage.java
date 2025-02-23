package com.pinkfactory.genio.infrastructure.clova;

import lombok.Builder;
import lombok.Value;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Value
@Builder
public class ClovaStudioMessage {

    private ClovaStudioMessageRole role;

    private String content;
}
