package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
@Schema(description = "Strength response")
public record StrengthResponse(
        @Schema(description = "The value representing the strength characteristic", example = "Analytical Thinking")
                String value) {}
