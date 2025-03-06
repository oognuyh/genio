package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.application.CardService;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.CardResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.GenerateCardRequest;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1CardAPISpecification;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.SseEmitterRegistry;
import com.pinkfactory.genio.port.in.GenerateCardUseCase.GenerateCardCommand;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/cards")
public class V1CardController implements V1CardAPISpecification {

    private final CardService service;

    private static final long TIMEOUT = 600_000L;

    private final ExecutorService executorService = Executors.newCachedThreadPool();

    private final SseEmitterRegistry registry;

    @Override
    @PostMapping
    public ResponseEntity<CardResponse> generateCard(@Valid @RequestBody GenerateCardRequest request) {

        var cardId = IDGenerator.generate();

        var command = GenerateCardCommand.builder()
                .cardId(cardId)
                .name(request.name())
                .stage(request.stage())
                .jobCategory(request.jobCategory())
                .position(request.position())
                .skillSet(request.skillSet())
                .experience(request.experience())
                .strengths(request.strengths())
                .tone(request.tone())
                .build();

        var card = service.generateCard(command);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CardResponse.builder()
                        .cardId(card.cardId())
                        .name(request.name())
                        .jobCategory(request.jobCategory())
                        .position(request.position())
                        .tagline(card.tagline())
                        .biography(card.biography())
                        .hashtags(card.hashtags())
                        .colors(card.colors())
                        .build());
    }

    @Override
    @PostMapping("/stream")
    public SseEmitter generateCardAsStream(@Valid @RequestBody GenerateCardRequest request) {

        var emitter = new SseEmitter(TIMEOUT);
        var cardId = IDGenerator.generate();

        registry.register(cardId, emitter);

        var command = GenerateCardCommand.builder()
                .cardId(cardId)
                .name(request.name())
                .stage(request.stage())
                .jobCategory(request.jobCategory())
                .position(request.position())
                .skillSet(request.skillSet())
                .experience(request.experience())
                .strengths(request.strengths())
                .tone(request.tone())
                .build();

        executorService.execute(() -> {
            try {

                emitter.send(Event.builder()
                        .type(EventType.RUNNING)
                        .message("슬로건을 만들고 있어요.")
                        .build());

                var card = service.generateCard(command);

                emitter.send(Event.<CardResponse>builder()
                        .type(EventType.COMPLETED)
                        .message("퍼스널 브랜딩이 곧 완성돼요.")
                        .result(CardResponse.builder()
                                .cardId(card.cardId())
                                .name(request.name())
                                .jobCategory(request.jobCategory())
                                .position(request.position())
                                .tagline(card.tagline())
                                .biography(card.biography())
                                .hashtags(card.hashtags())
                                .colors(card.colors())
                                .build())
                        .build());

                emitter.complete();
            } catch (Exception e) {

                try {
                    log.error("Failed to generate card: {}", e.getMessage());

                    if (e instanceof ResponseStatusException e2) {

                        emitter.send(Event.builder()
                                .type(EventType.FAILED)
                                .message(e2.getReason())
                                .build());
                    } else {

                        emitter.send(Event.builder()
                                .type(EventType.FAILED)
                                .message(e.getMessage())
                                .build());
                    }

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

                registry.unregister(cardId);
            }
        });

        return emitter;
    }
}
