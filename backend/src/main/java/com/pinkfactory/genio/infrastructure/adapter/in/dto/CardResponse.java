package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import com.pinkfactory.genio.domain.Recommended;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
@Schema(description = "Card response")
public record CardResponse(
        @Schema(description = "Generated card identifier", example = "a9b7c243-2640-4d05-ab1c-84ac4f207678")
                String cardId,
        @Schema(description = "Extracted name from resume", example = "John Doe") String name,
        String jobCategory,
        @Schema(description = "Current or most recent position", example = "Backend Developer") String position,
        @Schema(description = "Generated tagline for the card", example = "Innovate Together, Grow Forever")
                String tagline,
        @Schema(
                        description = "Generated biography text",
                        example = "We are a creative team dedicated to bringing your ideas to life")
                String biography,
        @Schema(
                        description = "Hashtags for social sharing and categorization",
                        example = "[\"#JavaDeveloper\", \"#CloudArchitect\", \"#AgileTeam\"]")
                List<Recommended<String>> hashtags,
        @Schema(
                        description = "List of recommended colors with confidence scores",
                        example =
                                """
               [
                 {
                   "value": "#FF5733",
                   "confidence": 0.95,
                   "reason": "This vibrant orange represents energy and creativity, matching your company's innovative spirit"
                 }
               ]
               """)
                List<Recommended<String>> colors) {

    public CardResponse {

        colors = Objects.requireNonNullElse(colors, new ArrayList<>());
    }
}
