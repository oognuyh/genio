package com.pinkfactory.genio.port.in;

import com.pinkfactory.genio.domain.Card;
import java.util.List;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public interface GenerateCardUseCase {

    @Builder
    record GenerateCardCommand(
            String name,
            String position,
            List<String> experiences,
            List<String> skills,
            List<String> strengths,
            String tone) {}

    /**
     * Generates a card from the provided command data.
     *
     * @param command Command object containing the necessary data for card generation
     * @return Generated card representation
     */
    Card generateCard(GenerateCardCommand command);
}
