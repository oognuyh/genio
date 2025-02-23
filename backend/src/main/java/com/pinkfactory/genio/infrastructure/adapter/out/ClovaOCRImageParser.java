package com.pinkfactory.genio.infrastructure.adapter.out;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pinkfactory.genio.infrastructure.clova.ClovaOCRClient;
import com.pinkfactory.genio.infrastructure.clova.ClovaOCRProperties;
import com.pinkfactory.genio.infrastructure.clova.ClovaOCRRequest;
import com.pinkfactory.genio.infrastructure.clova.ClovaOCRRequest.ClovaOCRImage;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.port.out.ImageParser;
import com.pinkfactory.genio.port.out.MimeTypeDetector;
import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@EnableConfigurationProperties(ClovaOCRProperties.class)
public class ClovaOCRImageParser implements ImageParser {

    private final ClovaOCRClient client;

    private final MimeTypeDetector detector;

    private final ClovaOCRProperties properties;

    private static final String BOUNDING_POLY = "boundingPoly";

    private static final String VERTICES = "vertices";

    public ClovaOCRImageParser(MimeTypeDetector detector, ClovaOCRProperties properties, ObjectMapper binder) {
        this.properties = properties;
        this.detector = detector;
        this.client = Feign.builder()
                .encoder(new JacksonEncoder(binder))
                .decoder(new JacksonDecoder(binder))
                .requestInterceptor(template -> template.header("X-OCR-SECRET", this.properties.secretKey()))
                .target(ClovaOCRClient.class, this.properties.apiGatewayUrl());
    }

    @Override
    public String parse(Supplier<InputStream> file) {

        var mimeType = detector.detect(file);

        try (var stream = file.get()) {

            var request = ClovaOCRRequest.builder()
                    .images(Collections.singletonList(ClovaOCRImage.builder()
                            .format(mimeType.replace("image/", ""))
                            .name(IDGenerator.generate())
                            .data(Base64.getEncoder().encodeToString(stream.readAllBytes()))
                            .build()))
                    .build();

            var output = client.recognize(request);

            var isOk = output.at("/images/0/inferResult").asText("FAILURE").equals("SUCCESS");

            if (!isOk) {

                var message = output.at("/images/0/message").asText("Failed to recognize the given image.");

                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, message);
            }

            return Optional.of(output)
                    .map(node -> node.get("images").get(0).get("fields"))
                    .filter(JsonNode::isArray)
                    .map(fields -> {
                        List<JsonNode> fieldList = StreamSupport.stream(fields.spliterator(), false)
                                .toList();

                        double baseThreshold = fieldList.stream()
                                .mapToDouble(field -> {
                                    JsonNode vertices = field.get(BOUNDING_POLY).get(VERTICES);
                                    return Math.abs(vertices.get(3).get("y").asDouble()
                                            - vertices.get(0).get("y").asDouble());
                                })
                                .average()
                                .orElse(30.0);

                        Map<Integer, List<JsonNode>> groups = fieldList.stream()
                                .collect(Collectors.groupingBy(
                                        field -> (int) (field.get(BOUNDING_POLY)
                                                        .get(VERTICES)
                                                        .get(0)
                                                        .get("y")
                                                        .asDouble()
                                                / baseThreshold),
                                        TreeMap::new,
                                        Collectors.toList()));

                        List<List<JsonNode>> mergedGroups = new ArrayList<>();
                        List<JsonNode> currentGroup = null;
                        double lastY = -1;

                        for (List<JsonNode> group : groups.values()) {
                            double currentY = group.getFirst()
                                    .get(BOUNDING_POLY)
                                    .get(VERTICES)
                                    .get(0)
                                    .get("y")
                                    .asDouble();

                            if (currentGroup == null || currentY - lastY > baseThreshold * 0.8) {
                                currentGroup = new ArrayList<>();
                                mergedGroups.add(currentGroup);
                            }

                            currentGroup.addAll(group);
                            lastY = currentY;
                        }

                        return mergedGroups.stream()
                                .map(group -> group.stream()
                                        .sorted(Comparator.comparingDouble(a -> a.get(BOUNDING_POLY)
                                                .get(VERTICES)
                                                .get(0)
                                                .get("x")
                                                .asDouble()))
                                        .map(field -> field.get("inferText").asText())
                                        .collect(Collectors.joining(" ")))
                                .collect(Collectors.joining("\n"));
                    })
                    .orElse("");
        } catch (IOException e) {

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
