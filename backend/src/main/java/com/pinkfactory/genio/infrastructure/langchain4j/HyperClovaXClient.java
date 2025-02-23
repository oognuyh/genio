package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.databind.node.ObjectNode;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
public interface HyperClovaXClient {

    @RequestLine("POST /v1/chat-completions/{model}")
    @Headers("Content-Type: application/json")
    ObjectNode chat(@Param("model") String model, HyperClovaXChatCompletionRequest request);
}
