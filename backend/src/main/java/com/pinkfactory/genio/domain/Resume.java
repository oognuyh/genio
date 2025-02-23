package com.pinkfactory.genio.domain;

import java.util.List;
import lombok.Builder;
import lombok.Value;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Value
@Builder(toBuilder = true)
public class Resume {

    /** 고유 번호 */
    private String resumeId;

    /** 이름 */
    private String name;

    /** 직책 */
    private String position;

    /** 장점 목록 */
    private List<String> strengths;

    /** 기술 스택 목록 */
    private List<String> skills;

    /** 경력 또는 경험 목록 */
    private List<String> experiences;
}
