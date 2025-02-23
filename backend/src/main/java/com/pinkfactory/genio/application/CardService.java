package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.port.in.GenerateCardUseCase;
import com.pinkfactory.genio.port.out.CardGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Service
@RequiredArgsConstructor
public class CardService implements GenerateCardUseCase {

    private final CardGenerator generator;

    @Override
    public Card generateCard(GenerateCardCommand command) {

        return generator.generate(null);
    }
}
