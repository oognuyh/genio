package com.pinkfactory.genio.port.in;

import com.pinkfactory.genio.domain.Resume;
import java.io.InputStream;
import java.util.function.Supplier;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
public interface ExtractResumeUseCase {

    @Builder
    public record ExtractResumeCommand(Supplier<InputStream> file) {}

    public Resume extractResume(ExtractResumeCommand command);
}
