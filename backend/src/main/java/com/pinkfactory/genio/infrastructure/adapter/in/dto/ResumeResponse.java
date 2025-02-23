package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
@Schema(description = "Resume response")
public record ResumeResponse(
        @Schema(description = "Generated resume identifier", example = "4fc2a0a8-8080-47be-b4be-a2e70e1fd329")
                String resumeId,
        @Schema(description = "Extracted name from resume", example = "John Doe") String name,
        @Schema(description = "Current or most recent position", example = "Backend Developer") String position,
        @Schema(
                        description = "List of technical and professional skills",
                        example = "[\"Java\", \"Spring Boot\", \"AWS\", \"Agile Development\"]")
                List<String> skills,
        @Schema(
                        description = "List of work experiences",
                        example =
                                "[\"Senior Software Engineer at Tech Corp (2020-Present)\", \"Software Developer at Innovation Inc (2018-2020)\"]")
                List<String> experiences) {}
