package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import com.pinkfactory.genio.domain.Recommended;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Builder
@Schema(description = "Card response")
public class CardResponse {

    @Schema(description = "Generated card identifier", example = "a9b7c243-2640-4d05-ab1c-84ac4f207678")
    private String cardId;

    @Schema(description = "Generated slogan for the card", example = "Innovate Together, Grow Forever")
    private String slogan;

    @Schema(
            description = "Generated introduction text",
            example = "We are a creative team dedicated to bringing your ideas to life")
    private String introduction;

    @Builder.Default
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
    private List<Recommended<String>> colors = new ArrayList<>();
}
