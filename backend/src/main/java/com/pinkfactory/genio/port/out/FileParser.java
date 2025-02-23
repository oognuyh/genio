package com.pinkfactory.genio.port.out;

import java.io.InputStream;
import java.util.function.Supplier;

public interface FileParser {

    String parse(Supplier<InputStream> file);
}
