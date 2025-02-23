package com.pinkfactory.genio.infrastructure.langchain4j;

import lombok.Builder;
import lombok.Value;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Value
@Builder
public class HyperClovaXMessage {

    private HyperClovaXMessageRole role;

    private String content;
}
