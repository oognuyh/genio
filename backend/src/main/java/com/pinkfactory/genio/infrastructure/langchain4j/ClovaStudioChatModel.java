package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioChatCompletionRequest;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioClient;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioMessage;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioProperties;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.FinishReason;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.output.TokenUsage;
import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import java.util.List;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@EnableConfigurationProperties(ClovaStudioProperties.class)
public class ClovaStudioChatModel implements ChatLanguageModel {

    private final ClovaStudioProperties properties;

    private final ClovaStudioClient client;

    public ClovaStudioChatModel(ClovaStudioProperties properties, ObjectMapper binder) {

        this.properties = properties;
        this.client = Feign.builder()
                .encoder(new JacksonEncoder(binder))
                .decoder(new JacksonDecoder(binder))
                .requestInterceptor(
                        template -> template.header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.apiKey()))
                .target(ClovaStudioClient.class, properties.baseUrl());
    }

    @Override
    public Response<AiMessage> generate(List<ChatMessage> messages) {

        var request = ClovaStudioChatCompletionRequest.builder()
                .messages(messages.stream().map(ClovaStudioMessage::of).toList())
                .temperature(properties.temperature())
                .maxTokens(properties.maxTokens())
                .topK(properties.topK())
                .topP(properties.topP())
                .repeatPenalty(properties.repeatPenalty())
                .stopBefore(properties.stopBefore())
                .seed(properties.seed())
                .build();

        var output = client.chat(properties.modelName(), request);

        var text = output.at("/result/message/content").asText();
        var usage = new TokenUsage(
                output.at("/result/inputLength").asInt(),
                output.at("/result/outputLength").asInt());
        var finishReason =
                switch (output.at("/result/stopReason").asText()) {
                    case "length", "end_token" -> FinishReason.LENGTH;
                    case "stop_before" -> FinishReason.STOP;
                    default -> FinishReason.OTHER;
                };

        return Response.from(AiMessage.from(text), usage, finishReason);
    }
}
