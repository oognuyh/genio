package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
@Schema(description = "Job category response")
public record JobCategoryResponse(
        @Schema(description = "Job category name", example = "Development") String name,
        @Schema(
                        description = "List of positions within this job category",
                        example = "[\"Backend Developer\", \"Frontend Developer\", \"Mobile Developer\"]")
                List<String> positions,
        @Schema(
                        description = "List of skills associated with this job category",
                        example = "[\"Java\", \"Spring\", \"React\", \"JavaScript\", \"Docker\", \"AWS\"]")
                List<String> skillSet) {}
