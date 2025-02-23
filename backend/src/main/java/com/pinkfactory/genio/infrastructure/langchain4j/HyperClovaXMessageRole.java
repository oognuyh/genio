package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
public enum HyperClovaXMessageRole {
    @JsonProperty("system")
    SYSTEM,
    @JsonProperty("user")
    USER,
    @JsonProperty("assistant")
    ASSISTANT
}
