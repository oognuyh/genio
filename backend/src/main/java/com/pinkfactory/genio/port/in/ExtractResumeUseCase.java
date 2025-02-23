package com.pinkfactory.genio.port.in;

import com.pinkfactory.genio.domain.Resume;
import java.io.InputStream;
import java.util.function.Supplier;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public interface ExtractResumeUseCase {

    @Builder
    record ExtractResumeCommand(Supplier<InputStream> file) {}

    /**
     * Extracts resume information from the provided resume file.
     *
     * @param command Command object containing a supplier for the resume file input stream
     * @return The extracted resume information
     */
    Resume extractResume(ExtractResumeCommand command);
}
