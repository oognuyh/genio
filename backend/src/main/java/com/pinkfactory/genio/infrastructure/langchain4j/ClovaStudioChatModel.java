package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioChatCompletionRequest;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioClient;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioMessage;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioProperties;
import com.pinkfactory.genio.infrastructure.clova.ClovaStudioRequestInterceptor;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.FinishReason;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.output.TokenUsage;
import feign.FeignException;
import feign.Retryer;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import io.github.resilience4j.bulkhead.Bulkhead;
import io.github.resilience4j.bulkhead.BulkheadConfig;
import io.github.resilience4j.bulkhead.BulkheadFullException;
import io.github.resilience4j.feign.FeignDecorators;
import io.github.resilience4j.feign.Resilience4jFeign;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@EnableConfigurationProperties(ClovaStudioProperties.class)
public class ClovaStudioChatModel implements ChatLanguageModel {

    private final ClovaStudioProperties properties;

    private final ClovaStudioClient client;

    public ClovaStudioChatModel(
            ClovaStudioProperties properties, ClovaStudioRequestInterceptor requestInterceptor, ObjectMapper binder) {

        this.properties = properties;
        this.client = Resilience4jFeign.builder(FeignDecorators.builder()
                        .withRateLimiter(RateLimiter.of(
                                "limiter",
                                RateLimiterConfig.custom()
                                        .limitRefreshPeriod(Duration.ofMinutes(1))
                                        .limitForPeriod(3)
                                        .timeoutDuration(Duration.ofSeconds(0))
                                        .build()))
                        .withBulkhead(Bulkhead.of(
                                "bulkhead",
                                BulkheadConfig.custom()
                                        .maxConcurrentCalls(3)
                                        .maxWaitDuration(Duration.ofMinutes(1))
                                        .build()))
                        .build())
                .encoder(new JacksonEncoder(binder))
                .decoder(new JacksonDecoder(binder))
                .retryer(Retryer.NEVER_RETRY)
                .requestInterceptor(requestInterceptor)
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

        try {
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
        } catch (RequestNotPermitted | BulkheadFullException | FeignException e) {

            if (e instanceof RequestNotPermitted
                    || e instanceof BulkheadFullException
                    || e.getMessage().contains("42901")) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "요청이 많아 진행할 수 없어요. 잠시 후 다시 시도해주세요.");
            }

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
