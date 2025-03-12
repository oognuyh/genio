package com.pinkfactory.genio.infrastructure.adapter.out;

import com.pinkfactory.genio.port.out.MimeTypeDetector;
import java.io.IOException;
import java.io.InputStream;
import java.util.function.Supplier;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Component
public class TikaMimeTypeDetector implements MimeTypeDetector {

    private final Tika tika = new Tika();

    @Override
    public String detect(Supplier<InputStream> file) {

        try (var stream = file.get()) {

            return tika.detect(stream);
        } catch (IOException e) {

            log.error(e.getMessage(), e.getCause());

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
