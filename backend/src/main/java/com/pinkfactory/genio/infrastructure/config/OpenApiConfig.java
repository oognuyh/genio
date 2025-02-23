package com.pinkfactory.genio.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder().group("v1").pathsToMatch("/api/v1/**").build();
    }

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info().title("Genio API Specification").version("1.0"));
    }
}
