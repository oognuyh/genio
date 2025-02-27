package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.port.in.GenerateCardUseCase;
import com.pinkfactory.genio.port.out.CardGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Service
@RequiredArgsConstructor
public class CardService implements GenerateCardUseCase {

    private final CardGenerator generator;

    @Override
    public Card generateCard(GenerateCardCommand command) {

        return generator
                .generate(
                        command.cardId(),
                        Resume.builder()
                                .name(command.name())
                                .stage(command.stage())
                                .jobCategory(command.jobCategory())
                                .position(command.position())
                                .experience(command.experience())
                                .strengths(command.strengths())
                                .skillSet(command.skillSet())
                                .build(),
                        command.tone())
                .toBuilder()
                .cardId(command.cardId())
                .build();
    }
}
