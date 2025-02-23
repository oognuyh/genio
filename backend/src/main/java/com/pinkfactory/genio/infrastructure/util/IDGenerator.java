package com.pinkfactory.genio.infrastructure.util;

import java.util.UUID;
import lombok.experimental.UtilityClass;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@UtilityClass
public class IDGenerator {

    /**
     * Generates a new identifier.
     *
     * @return The generated identifier
     */
    public static String generate() {

        return UUID.randomUUID().toString();
    }
}
