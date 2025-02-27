package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase;
import com.pinkfactory.genio.port.out.MimeTypeDetector;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import com.pinkfactory.genio.port.out.TokenEstimator;
import java.util.Objects;
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

    private final TokenEstimator estimator;

    private final SseEmitterRegistry registry;

    @Override
    public Resume extractResume(ExtractResumeCommand command) {

        var resumeId = Objects.requireNonNullElse(command.resumeId(), IDGenerator.generate());

        var mimeType = detector.detect(command.file());

        registry.send(
                resumeId,
                Event.builder()
                        .type(EventType.RUNNING)
                        .message("이력서를 확인하고 있어요.")
                        .build());

        var content = factory.get(mimeType).parse(command.file());

        var count = estimator.estimate(content);

        registry.send(
                resumeId,
                Event.builder()
                        .type(EventType.RUNNING)
                        .message("총 %d 토큰의 텍스트를 읽고 있어요.".formatted(count))
                        .build());

        return extractor.extract(resumeId, content).toBuilder()
                .resumeId(resumeId)
                .build();
    }
}
