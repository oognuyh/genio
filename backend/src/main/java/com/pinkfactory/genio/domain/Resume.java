package com.pinkfactory.genio.domain;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Data
@Jacksonized
@Builder(toBuilder = true)
public class Resume {

    private String resumeId;

    private String name;

    private String position;

    private List<String> strengths;

    private List<String> skillSet;

    private List<String> experiences;
}
