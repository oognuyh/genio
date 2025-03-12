package com.pinkfactory.genio.port.out;

import java.io.InputStream;
import java.util.function.Supplier;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@FunctionalInterface
public interface Parser {

    /**
     * Parses content from the provided input stream.
     *
     * @param file Supplier that provides an InputStream for the file to be parsed
     * @return Parsed content as a String
     */
    String parse(Supplier<InputStream> file);
}
