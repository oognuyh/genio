package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.CardResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.GenerateCardRequest;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.WebSocketSessionRegistry;
import com.pinkfactory.genio.port.in.GenerateCardUseCase;
import com.pinkfactory.genio.port.in.GenerateCardUseCase.GenerateCardCommand;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class V1CardWebSocketHandler extends AbstractWebSocketHandler {

    private final GenerateCardUseCase useCase;

    private final WebSocketSessionRegistry registry;

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {

        registry.register(session);
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, TextMessage message) throws IOException {

        var cardId = session.getId();
        var text = message.getPayload();
        var request = JsonUtil.deserialize(text, GenerateCardRequest.class);

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

        try {

            session.sendMessage(new TextMessage(JsonUtil.serialize(Event.builder()
                    .type(EventType.RUNNING)
                    .message("슬로건을 만들고 있어요.")
                    .build())));

            var card = useCase.generateCard(command);

            session.sendMessage(new TextMessage(JsonUtil.serialize(Event.<CardResponse>builder()
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
                    .build())));
        } catch (IOException e) {

            throw new IllegalStateException(e);
        } catch (ResponseStatusException e) {

            session.sendMessage(new TextMessage(JsonUtil.serialize(Event.builder()
                    .type(EventType.FAILED)
                    .message(e.getReason())
                    .build())));
        } catch (Exception e) {

            session.sendMessage(new TextMessage(JsonUtil.serialize(Event.builder()
                    .type(EventType.FAILED)
                    .message(e.getMessage())
                    .build())));
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus closeStatus) {

        registry.unregister(session);
    }

    @Override
    public boolean supportsPartialMessages() {

        return false;
    }
}
