package com.pinkfactory.genio.infrastructure.sse;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.ZonedDateTime;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Jacksonized
@Builder(toBuilder = true)
public class Event<T> {

    public enum EventType {
        @JsonProperty("running")
        RUNNING,
        @JsonProperty("completed")
        COMPLETED,
        @JsonProperty("failed")
        FAILED,
    }

    private EventType type;

    private String message;

    private T result;

    @Builder.Default
    private ZonedDateTime timestamp = ZonedDateTime.now();
}
