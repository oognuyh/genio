package com.pinkfactory.genio.infrastructure.clova;

import com.fasterxml.jackson.databind.node.ObjectNode;
import feign.Headers;
import feign.RequestLine;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public interface ClovaOCRClient {

    @RequestLine("POST /general")
    @Headers("Content-Type: application/json")
    ObjectNode recognize(ClovaOCRRequest request);
}
