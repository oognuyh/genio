package com.pinkfactory.genio.infrastructure.websocket;

import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Component
public class WebSocketSessionRegistry {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public void register(WebSocketSession session) {

        sessions.put(session.getId(), session);
    }

    public void unregister(WebSocketSession session) {

        sessions.remove(session.getId());
    }

    public <T> void send(String sessionId, Event<T> event) {

        Optional.ofNullable(sessions.get(sessionId)).ifPresent(session -> {
            try {

                session.sendMessage(new TextMessage(JsonUtil.serialize(event)));
            } catch (IOException e) {

                throw new IllegalStateException(e);
            }
        });
    }
}
