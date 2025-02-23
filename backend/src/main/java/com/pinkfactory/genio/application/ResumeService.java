package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase;
import com.pinkfactory.genio.port.out.MimeTypeDetector;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Service
@RequiredArgsConstructor
public class ResumeService implements ExtractResumeUseCase {

    private final ResumeExtractor extractor;

    private final ParserFactory factory;

    private final MimeTypeDetector detector;

    @Override
    public Resume extractResume(ExtractResumeCommand command) {

        var mimeType = detector.detect(command.file());

        var content = factory.get(mimeType).parse(command.file());

        return extractor.extract(content).toBuilder()
                .resumeId(IDGenerator.generate())
                .build();
    }
}
