package com.pinkfactory.genio.infrastructure.util;

import lombok.experimental.UtilityClass;
import org.springframework.util.StringUtils;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@UtilityClass
public class MimeTypeUtil {

    /**
     * Checks if the given MIME type corresponds to an image.
     *
     * @param mimeType the MIME type string to check
     * @return true if the MIME type starts with "image/", false otherwise
     * @throws IllegalArgumentException if the mimeType is null or empty
     */
    public static boolean isImage(String mimeType) {

        if (!StringUtils.hasText(mimeType)) {

            throw new IllegalArgumentException("MIME type cannot be null or empty.");
        }

        return mimeType.startsWith("image/");
    }
}
