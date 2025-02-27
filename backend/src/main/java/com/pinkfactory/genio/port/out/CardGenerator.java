package com.pinkfactory.genio.port.out;

import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.domain.Tone;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@FunctionalInterface
public interface CardGenerator {

    /**
     * Generates a card representation from the given resume.
     *
     * @param resume Resume data to be transformed into a card format
     * @param tone   Tone style to be reflected in the generated card's content and style
     * @return A card representation of the resume
     */
    Card generate(String cardId, Resume resume, Tone tone);
}
