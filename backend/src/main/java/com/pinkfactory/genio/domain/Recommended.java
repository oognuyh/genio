package com.pinkfactory.genio.domain;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Jacksonized
@Builder(toBuilder = true)
public class Recommended<T> {

    private T value;

    private Double confidence;

    private String reason;
}
