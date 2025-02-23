package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase;
import com.pinkfactory.genio.port.out.FileParser;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Service
@RequiredArgsConstructor
public class ResumeService implements ExtractResumeUseCase {

    private final ResumeExtractor extractor;

    private final FileParser parser;

    @Override
    public Resume extractResume(ExtractResumeCommand command) {

        var content = parser.parse(command.file());

        return extractor.extract(content);
    }
}
