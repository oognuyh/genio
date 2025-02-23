package com.pinkfactory.genio.infrastructure.langchain4j;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
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
@EnableConfigurationProperties(HyperClovaXProperties.class)
public class HyperClovaXChatModel implements ChatLanguageModel {

    private final HyperClovaXProperties properties;

    private final HyperClovaXClient client;

    public HyperClovaXChatModel(HyperClovaXProperties properties) {

        this.properties = properties;
        this.client = Feign.builder()
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .requestInterceptor(
                        template -> template.header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey()))
                .target(HyperClovaXClient.class, properties.getBaseUrl());
    }

    @Override
    @SuppressWarnings("java:S5738")
    public Response<AiMessage> generate(List<ChatMessage> messages) {

        var request = HyperClovaXChatCompletionRequest.builder()
                .messages(messages.stream()
                        .map(message -> {
                            if (message instanceof SystemMessage msg) {

                                return HyperClovaXMessage.builder()
                                        .role(HyperClovaXMessageRole.SYSTEM)
                                        .content(msg.text())
                                        .build();
                            } else if (message instanceof AiMessage msg) {

                                return HyperClovaXMessage.builder()
                                        .role(HyperClovaXMessageRole.ASSISTANT)
                                        .content(msg.text())
                                        .build();
                            } else if (message instanceof UserMessage msg) {

                                return HyperClovaXMessage.builder()
                                        .role(HyperClovaXMessageRole.USER)
                                        .content(msg.singleText())
                                        .build();
                            }

                            throw new UnsupportedOperationException("Unsupported message type: " + message.type());
                        })
                        .toList())
                .temperature(properties.getTemperature())
                .maxTokens(properties.getMaxTokens())
                .topK(properties.getTopK())
                .topP(properties.getTopP())
                .repeatPenalty(properties.getRepeatPenalty())
                .stopBefore(properties.getStopBefore())
                .seed(properties.getSeed())
                .build();

        var output = client.chat(properties.getModelName(), request);

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
