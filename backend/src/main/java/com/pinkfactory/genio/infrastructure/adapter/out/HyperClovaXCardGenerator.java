package com.pinkfactory.genio.infrastructure.adapter.out;

import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.port.out.CardGenerator;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
public class HyperClovaXCardGenerator implements CardGenerator {

    @Override
    public Card generate(Resume resume) {

        throw new UnsupportedOperationException("Unimplemented method 'generate'");
    }
}
