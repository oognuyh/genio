package com.pinkfactory.genio.application;

import com.pinkfactory.genio.infrastructure.util.MimeTypeUtil;
import com.pinkfactory.genio.port.out.DocumentParser;
import com.pinkfactory.genio.port.out.ImageParser;
import com.pinkfactory.genio.port.out.Parser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@RequiredArgsConstructor
public class ParserFactory {

    private final ImageParser imageParser;

    private final DocumentParser documentParser;

    /**
     * Returns the appropriate parser based on the MIME type.
     *
     * @param mimeType The MIME type of the file to be parsed (e.g., "image/jpeg", "application/pdf")
     * @return A Parser instance - either an image parser or document parser depending on the MIME type
     * @throws IllegalArgumentException if the mimeType is null or empty
     */
    public Parser get(String mimeType) {

        return MimeTypeUtil.isImage(mimeType) ? imageParser : documentParser;
    }
}
