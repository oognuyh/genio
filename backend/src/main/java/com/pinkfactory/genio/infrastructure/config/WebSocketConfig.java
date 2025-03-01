package com.pinkfactory.genio.infrastructure.config;

import com.pinkfactory.genio.infrastructure.adapter.in.V1CardWebSocketHandler;
import com.pinkfactory.genio.infrastructure.adapter.in.V1ResumeWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final V1ResumeWebSocketHandler resumeWebSocketHandler;

    private final V1CardWebSocketHandler cardWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(resumeWebSocketHandler, "/api/v1/resumes/stream")
                .addHandler(cardWebSocketHandler, "/api/v1/cards/stream")
                .setAllowedOrigins("*");
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        var container = new ServletServerContainerFactoryBean();

        container.setMaxBinaryMessageBufferSize(50 * 1024 * 1024);
        container.setMaxTextMessageBufferSize(1024 * 1024);

        return container;
    }
}
