package com.pinkfactory.genio.infrastructure.clova;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public enum ClovaStudioMessageRole {
    @JsonProperty("system")
    SYSTEM,
    @JsonProperty("user")
    USER,
    @JsonProperty("assistant")
    ASSISTANT
}
