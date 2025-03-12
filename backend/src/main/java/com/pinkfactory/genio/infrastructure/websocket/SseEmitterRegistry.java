package com.pinkfactory.genio.infrastructure.websocket;

import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitterRegistry {

    private final Map<String, SseEmitter> sessions = new ConcurrentHashMap<>();

    public void register(String emitterId, SseEmitter emitter) {

        sessions.put(emitterId, emitter);
    }

    public void unregister(String emitterId) {

        sessions.remove(emitterId);
    }

    public <T> void send(String emitterId, Event<T> event) {

        Optional.ofNullable(sessions.get(emitterId)).ifPresent(emitter -> {
            try {
                emitter.send(event);

            } catch (IOException e) {

                try {

                    emitter.send(Event.builder()
                            .type(EventType.FAILED)
                            .message(e.getMessage())
                            .build());
                } catch (IOException ignored) {
                    // Ignore
                }

                emitter.completeWithError(e);
            }
        });
    }
}
