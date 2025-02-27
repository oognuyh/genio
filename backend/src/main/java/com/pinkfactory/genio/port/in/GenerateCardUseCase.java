package com.pinkfactory.genio.port.in;

import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Strength;
import com.pinkfactory.genio.domain.Tone;
import java.util.List;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public interface GenerateCardUseCase {

    @Builder
    record GenerateCardCommand(
            String cardId,
            String name,
            String jobCategory,
            String stage,
            String position,
            String experience,
            List<String> skillSet,
            List<Strength> strengths,
            Tone tone) {}

    /**
     * Generates a card from the provided command data.
     *
     * @param command Command object containing the necessary data for card generation
     * @return Generated card representation
     */
    Card generateCard(GenerateCardCommand command);
}
