package com.pinkfactory.genio.port.in;

import com.pinkfactory.genio.domain.Card;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
public interface GenerateCardUseCase {

    record GenerateCardCommand(String name) {}

    public Card generateCard(GenerateCardCommand command);
}
