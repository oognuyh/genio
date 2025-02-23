package com.pinkfactory.genio.port.out;

import java.io.InputStream;
import java.util.function.Supplier;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@FunctionalInterface
public interface MimeTypeDetector {

    /**
     * Detects the MIME type of file from its input stream.
     *
     * @param file Supplier that provides an InputStream for the file to be analyzed
     * @return The detected MIME type as a String (e.g., "application/pdf", "text/plain")
     */
    String detect(Supplier<InputStream> file);
}
