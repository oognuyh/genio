package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.ResumeResponse;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import com.pinkfactory.genio.infrastructure.websocket.Event.EventType;
import com.pinkfactory.genio.infrastructure.websocket.WebSocketSessionRegistry;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase.ExtractResumeCommand;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class V1ResumeWebSocketHandler extends AbstractWebSocketHandler {

    private final ExtractResumeUseCase useCase;

    private final WebSocketSessionRegistry registry;

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {

        registry.register(session);
    }

    @Override
    protected void handleBinaryMessage(@NonNull WebSocketSession session, BinaryMessage message) throws IOException {

        var buffer = message.getPayload();
        var resumeId = session.getId();

        var command = ExtractResumeCommand.builder()
                .resumeId(resumeId)
                .file(() -> new ByteArrayInputStream(buffer.array()))
                .build();

        try {

            session.sendMessage(new TextMessage(JsonUtil.serialize(Event.builder()
                    .type(EventType.RUNNING)
                    .message("이력서를 확인하고 있어요.")
                    .build())));

            var resume = useCase.extractResume(command);

            session.sendMessage(new TextMessage(JsonUtil.serialize(Event.<ResumeResponse>builder()
                    .type(EventType.COMPLETED)
                    .message("모든 분석을 마쳤어요.")
                    .result(ResumeResponse.builder()
                            .resumeId(resume.resumeId())
                            .name(resume.name())
                            .jobCategory(resume.jobCategory())
                            .stage(resume.stage())
                            .position(resume.position())
                            .skillSet(resume.skillSet())
                            .experience(resume.experience())
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
