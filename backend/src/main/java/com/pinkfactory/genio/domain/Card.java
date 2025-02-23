package com.pinkfactory.genio.domain;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Getter
@Builder(toBuilder = true)
public class Card {

    /** 고유 번호 */
    private String cardId;

    private List<String> colors;
}
