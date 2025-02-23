package com.pinkfactory.genio.port.out;

import com.pinkfactory.genio.domain.Resume;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@FunctionalInterface
public interface ResumeExtractor {

    public Resume extract(String content);
}
