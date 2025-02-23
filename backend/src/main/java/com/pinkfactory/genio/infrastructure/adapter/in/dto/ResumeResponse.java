package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Builder
@Schema(description = "Resume response")
public class ResumeResponse {

    @Schema(description = "Generated resume identifier", example = "4fc2a0a8-8080-47be-b4be-a2e70e1fd329")
    private String resumeId;

    @Schema(description = "Extracted name from resume", example = "John Doe")
    private String name;

    @Schema(description = "Current or most recent position", example = "Backend Developer")
    private String position;

    @Schema(
            description = "List of key strengths extracted from resume",
            example = "[\"Problem Solving\", \"Team Leadership\", \"Strategic Thinking\"]")
    private List<String> strengths;

    @Schema(
            description = "List of technical and professional skills",
            example = "[\"Java\", \"Spring Boot\", \"AWS\", \"Agile Development\"]")
    private List<String> skills;

    @Schema(
            description = "List of work experiences",
            example =
                    "[\"Senior Software Engineer at Tech Corp (2020-Present)\", \"Software Developer at Innovation Inc (2018-2020)\"]")
    private List<String> experiences;
}
