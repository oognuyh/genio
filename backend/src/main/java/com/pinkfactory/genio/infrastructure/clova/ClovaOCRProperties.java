package com.pinkfactory.genio.infrastructure.clova;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@ConfigurationProperties(prefix = "clova.ocr")
public record ClovaOCRProperties(String secretKey, String apiGatewayUrl) {}
