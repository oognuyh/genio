package com.pinkfactory.genio.infrastructure.clova;

import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Builder
public class ClovaOCRRequest {

    @Builder.Default
    private String version = "V2";

    @Builder.Default
    private String requestId = IDGenerator.generate();

    @Builder.Default
    private Long timestamp = Instant.now().toEpochMilli();

    @Builder.Default
    private String lang = "ko";

    @Builder.Default
    private Boolean enableTableDetection = false;

    private List<ClovaOCRImage> images;

    @Builder
    public record ClovaOCRImage(String format, String name, String url, String data) {}
}
