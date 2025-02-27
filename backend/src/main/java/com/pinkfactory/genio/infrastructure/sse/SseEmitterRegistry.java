package com.pinkfactory.genio.infrastructure.sse;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitterRegistry {

    private final Map<String, SseEmitter> store = new ConcurrentHashMap<>();

    public void add(String emitterId, SseEmitter sseEmitter) {

        store.put(emitterId, sseEmitter);
    }

    public <T> void send(String emitterId, Event<T> event) {

        Optional.ofNullable(store.get(emitterId)).ifPresent(emitter -> {
            try {

                emitter.send(event);
            } catch (IOException e) {

                throw new IllegalStateException(e);
            }
        });
    }

    public void remove(String emitterId) {

        store.remove(emitterId);
    }
}
