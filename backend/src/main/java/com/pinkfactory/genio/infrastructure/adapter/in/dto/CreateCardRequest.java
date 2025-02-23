package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Schema(description = "Card creation request parameters")
public class CreateCardRequest {

    @Schema(description = "Name of the person", example = "John Doe")
    @NotBlank(message = "Name is required") private String name;

    @Schema(description = "Current or most recent position", example = "Full Stack Developer")
    @NotBlank(message = "Position is required") private String position;

    @Schema(
            description = "List of key strengths",
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
