package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
@Schema(description = "Tone response")
public record ToneResponse(
        @Schema(description = "The title of the tone", example = "Professional") String title,
        @Schema(
                        description = "The detailed description of the tone explaining its characteristics and usage",
                        example = "Formal language suitable for business communications and official documents")
                String description) {}
