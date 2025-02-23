package com.pinkfactory.genio.infrastructure.adapter.out;

import com.pinkfactory.genio.port.out.FileParser;
import java.io.IOException;
import java.io.InputStream;
import java.util.function.Supplier;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Component
public class TikaFileParser implements FileParser {

    private final Tika tika = new Tika();

    @Override
    public String parse(Supplier<InputStream> file) {

        try (var stream = file.get()) {

            return tika.parseToString(stream);
        } catch (IOException | TikaException e) {

            log.error(e.getMessage(), e.getCause());

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
