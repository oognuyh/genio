package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.SseEmitterRegistry;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase;
import com.pinkfactory.genio.port.out.MimeTypeDetector;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import com.pinkfactory.genio.port.out.TokenEstimator;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeService implements ExtractResumeUseCase {

    private final ResumeExtractor extractor;

    private final ParserFactory factory;

    private final MimeTypeDetector detector;

    private final TokenEstimator estimator;

    private final SseEmitterRegistry registry;

    @Override
    @SneakyThrows({InterruptedException.class})
    public Resume extractResume(ExtractResumeCommand command) {

        var resumeId = Objects.requireNonNullElse(command.resumeId(), IDGenerator.generate());

        var mimeType = detector.detect(command.file());

        log.info("[{}] 업로드된 문서는 {}입니다.", resumeId, mimeType);

        var content = factory.get(mimeType).parse(command.file());

        log.info("[{}] 추출된 문서 내용:\n {}", resumeId, content);

        var count = estimator.estimate(content);

        Thread.sleep(1000);

        registry.send(
                resumeId,
                Event.builder()
                        .type(EventType.RUNNING)
                        .message("내용을 꼼꼼히 읽고 있어요.")
                        .build());

        log.info("[{}] 총 토큰 수는 {}입니다.", resumeId, count);

        return extractor.extract(resumeId, content).toBuilder()
                .resumeId(resumeId)
                .build();
    }
}
