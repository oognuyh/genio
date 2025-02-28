package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.application.ResumeService;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.ResumeResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1ResumeAPISpecification;
import com.pinkfactory.genio.infrastructure.sse.Event;
import com.pinkfactory.genio.infrastructure.sse.Event.EventType;
import com.pinkfactory.genio.infrastructure.sse.SseEmitterRegistry;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase.ExtractResumeCommand;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/resumes")
public class V1ResumeController implements V1ResumeAPISpecification {

    private final ResumeService service;

    private final SseEmitterRegistry registry;

    private static final long TIMEOUT = 600_000L;

    private final ExecutorService executorService = Executors.newCachedThreadPool();

    @Override
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResumeResponse> extractResume(@RequestPart("file") MultipartFile file) {

        var command = ExtractResumeCommand.builder()
                .file(() -> {
                    try {

                        return file.getInputStream();
                    } catch (IOException e) {

                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
                    }
                })
                .build();

        var resume = service.extractResume(command);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResumeResponse.builder()
                        .resumeId(resume.resumeId())
                        .name(resume.name())
                        .jobCategory(resume.jobCategory())
                        .position(resume.position())
                        .skillSet(resume.skillSet())
                        .experience(resume.experience())
                        .build());
    }

    @Override
    @PostMapping(
            value = "/stream",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter extractResumeAsStream(@RequestPart("file") MultipartFile file) {

        var emitter = new SseEmitter(TIMEOUT);
        var resumeId = IDGenerator.generate();

        registry.add(resumeId, emitter);

        var command = ExtractResumeCommand.builder()
                .resumeId(resumeId)
                .file(() -> {
                    try {

                        return file.getInputStream();
                    } catch (IOException e) {

                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
                    }
                })
                .build();

        executorService.execute(() -> {
            try {

                emitter.send(Event.builder()
                        .type(EventType.RUNNING)
                        .message("이력서를 확인하고 있어요.")
                        .build());

                var resume = service.extractResume(command);

                emitter.send(Event.<ResumeResponse>builder()
                        .type(EventType.COMPLETED)
                        .message("모든 분석을 마쳤어요.")
                        .result(ResumeResponse.builder()
                                .resumeId(resume.resumeId())
                                .name(resume.name())
                                .jobCategory(resume.jobCategory())
                                .position(resume.position())
                                .skillSet(resume.skillSet())
                                .experience(resume.experience())
                                .build())
                        .build());

                emitter.complete();
            } catch (Exception e) {

                try {
                    emitter.send(Event.builder()
                            .type(EventType.FAILED)
                            .message(e.getMessage())
                            .build());

                    emitter.completeWithError(e);
                } catch (IOException sendError) {
                    log.error("Failed to send error event: {}", sendError.getMessage());
                    try {
                        emitter.complete();
                    } catch (Exception completeError) {
                        log.error("Failed to complete SSE connection: {}", completeError.getMessage());
                    }
                }
            } finally {

                registry.remove(resumeId);
            }
        });

        return emitter;
    }
}
