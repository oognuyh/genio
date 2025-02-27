package com.pinkfactory.genio.infrastructure.clova;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
public record ClovaStudioMessage(ClovaStudioMessageRole role, String content) {

    public static ClovaStudioMessage of(ChatMessage message) {

        if (message instanceof SystemMessage msg) {

            return ClovaStudioMessage.builder()
                    .role(ClovaStudioMessageRole.SYSTEM)
                    .content(msg.text())
                    .build();
        } else if (message instanceof AiMessage msg) {

            return ClovaStudioMessage.builder()
                    .role(ClovaStudioMessageRole.ASSISTANT)
                    .content(msg.text())
                    .build();
        } else if (message instanceof UserMessage msg) {

            return ClovaStudioMessage.builder()
                    .role(ClovaStudioMessageRole.USER)
                    .content(msg.singleText())
                    .build();
        }

        throw new UnsupportedOperationException("Unsupported message type: " + message.type());
    }
}
