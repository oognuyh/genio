package com.pinkfactory.genio.infrastructure.clova;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(ClovaStudioProperties.class)
public class ClovaStudioRequestInterceptor implements RequestInterceptor {

    private final ClovaStudioProperties properties;

    private final AtomicInteger counter = new AtomicInteger(0);

    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    public void apply(RequestTemplate template) {

        var apiKeys = Arrays.stream(properties.apiKey().split(",")).toList();

        if (apiKeys.size() == 1) {

            template.header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + apiKeys.getFirst());

            return;
        }

        int index = counter.getAndIncrement() % apiKeys.size();
        if (counter.get() > 10000) counter.set(index + 1);

        template.header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + apiKeys.get(index));
    }
}
