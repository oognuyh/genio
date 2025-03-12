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

    private String jobCategory;

    private String englishName;

    private String position;

    private String stage;

    private List<Strength> strengths;

    private List<String> skillSet;

    private Tone tone;

    private String experience;
}
