package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Schema(description = "Card generation request parameters")
public record GenerateCardRequest(
        @Schema(description = "Name of the person", example = "John Doe") @NotBlank(message = "Name is required") String name,
        @Schema(description = "Current or most recent position", example = "Full Stack Developer")
                @NotBlank(message = "Position is required") String position,
        @Schema(
                        description = "List of key strengths",
                        example = "[\"Problem Solving\", \"Team Leadership\", \"Strategic Thinking\"]")
                List<String> strengths,
        @Schema(
                        description = "List of technical and professional skills",
                        example = "[\"Java\", \"Spring Boot\", \"AWS\", \"Agile Development\"]")
                List<String> skills,
        @Schema(
                        description = "List of work experiences",
                        example =
                                "[\"Senior Software Engineer at Tech Corp (2020-Present)\", \"Software Developer at Innovation Inc (2018-2020)\"]")
                List<String> experiences,
        @Schema(
                        description = "Card generation purpose (RECRUITMENT/NETWORKING/FREELANCE/PERSONAL_BRANDING)",
                        example = "RECRUITMENT")
                String tone) {}
