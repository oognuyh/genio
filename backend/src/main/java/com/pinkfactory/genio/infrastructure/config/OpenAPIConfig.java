package com.pinkfactory.genio.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ForwardedHeaderFilter;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Configuration
public class OpenAPIConfig {

    @Bean
    GroupedOpenApi v1API() {
        return GroupedOpenApi.builder().group("v1").pathsToMatch("/api/v1/**").build();
    }

    @Bean
    OpenAPI openAPI() {
        return new OpenAPI().info(new Info().title("Genio API Specification").version("1.0"));
    }

    @Bean
    ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }
}
