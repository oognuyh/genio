package com.pinkfactory.genio.port.out;

import com.pinkfactory.genio.domain.Resume;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@FunctionalInterface
public interface ResumeExtractor {

    /**
     * Extracts resume information from the given content.
     *
     * @param resumeId Unique identifier for the resume being processed
     * @param content String content containing resume information to be extracted
     * @return A structured Resume object containing the extracted information
     */
    Resume extract(String resumeId, String content);
}
