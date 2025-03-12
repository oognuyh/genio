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
public class JobCategory {

    private String name;

    private List<String> positions;

    private List<String> skillSet;
}
