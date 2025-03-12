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
public class Card {

    private String cardId;

    private String tagline;

    private String biography;

    private List<Recommended<String>> colors;

    List<Recommended<String>> hashtags;
}
