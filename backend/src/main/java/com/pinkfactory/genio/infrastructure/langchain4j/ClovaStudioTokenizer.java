package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioClient;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioMessage;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioProperties;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioRequestInterceptor;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioTokenizationRequest;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.Tokenizer;
import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import java.util.List;
import java.util.stream.StreamSupport;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@EnableConfigurationProperties(ClovaStudioProperties.class)
public class ClovaStudioTokenizer implements Tokenizer {

    private final ClovaStudioProperties properties;

    private final ClovaStudioClient client;

    public ClovaStudioTokenizer(
            ClovaStudioProperties properties, ClovaStudioRequestInterceptor requestInterceptor, ObjectMapper binder) {

        this.properties = properties;
        this.client = Feign.builder()
                .encoder(new JacksonEncoder(binder))
                .decoder(new JacksonDecoder(binder))
                .requestInterceptor(requestInterceptor)
                .target(ClovaStudioClient.class, "https://clovastudio.stream.ntruss.com/");
    }

    @Override
    public int estimateTokenCountInText(String text) {

        return estimateTokenCountInMessage(UserMessage.from(text));
    }

    @Override
    public int estimateTokenCountInMessage(ChatMessage message) {

        return estimateTokenCountInMessages(List.of(message));
    }

    @Override
    public int estimateTokenCountInMessages(Iterable<ChatMessage> messages) {

        var request = ClovaStudioTokenizationRequest.builder()
                .messages(StreamSupport.stream(messages.spliterator(), false)
                        .map(ClovaStudioMessage::of)
                        .toList())
                .build();

        var output = client.tokenize(properties.modelName(), request);

        return StreamSupport.stream(output.withArray("/result/messages").spliterator(), false)
                .mapToInt(message -> message.at("/count").asInt(0))
                .sum();
    }

    @Override
    public int estimateTokenCountInToolSpecifications(Iterable<ToolSpecification> toolSpecifications) {

        return -1;
    }

    @Override
    public int estimateTokenCountInToolExecutionRequests(Iterable<ToolExecutionRequest> toolExecutionRequests) {

        return -1;
    }
}
