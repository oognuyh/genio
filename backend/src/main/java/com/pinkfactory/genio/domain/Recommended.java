package com.pinkfactory.genio.domain;

import lombok.Builder;
import lombok.Value;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Value
@Builder(toBuilder = true)
public class Recommended<T> {

    private T value;

    private Double confidence;

    private String reason;
}
