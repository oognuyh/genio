package com.pinkfactory.genio.infrastructure.adapter.out;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@RequiredArgsConstructor
public class SimpleResumeExtractor implements ResumeExtractor {

    private final ChatLanguageModel model;

    private final JsonMapper mapper;

    private static final Pattern PATTERN = Pattern.compile("```json\\s*\\n(.*?)```", Pattern.DOTALL);

    @Override
    public Resume extract(String resumeId, String content) {

        var prompts = List.of(
                PromptTemplate.from(
                                """
                ### 역할
                당신은 이미지/문서에서 추출된 이력서 정보에서 특정 정보를 추출하는 것에 유능한 전문가입니다.

                ### 목표
                당신은 사용자가 업로드한 이미지/문서가 텍스트로 추출되어 입력으로 받습니다.
                해당 텍스트를 근거로 JSON을 생성해야 합니다.
                추출된 결과에 오타가 존재할 수 있으며, 오타는 수정해도 괜찮습니다.
                단, 이력서에 존재하지 않는 내용을 생성하지 않습니다.

                ### 추출할 항목
                - 이름: 사용자명으로 보통 상단에 존재한다. 여러 언어가 존재할 때, 한국어를 최우선으로 한다.
                - 직무: 사용자의 직무로 사용자가 직접 기입한 것을 최우선으로 없다면, 최근 경력사항도 살펴본다.
                - 경력사항: 일반적으로 회사, 재직 기간, 수행한 프로젝트 목록, 그리고 해당 프로젝트 속 나의 역할과 문제 해결 능력을 기입한다. 있다면 마크다운 문자열로 전부 가져온다.
                  사용자의 경력사항을 아래와 같은 양식으로 변환해 가져온다:
                  <start_of_example>
                  ABC 테크놀로지 (2021.03 - 현재)
                  수석 프론트엔드 개발자
                  - React와 TypeScript를 사용한 웹 애플리케이션 개발
                  - 사용자 경험 최적화로 페이지 로딩 시간 30% 단축
                  기술: React, TypeScript, Redux, Webpack, Jest

                  프로젝트:
                  1. 대시보드 리뉴얼 (2022.05 - 2022.12)
                     - 사용자 인터랙션 개선으로 전환율 15% 상승
                     - 기술: React, TypeScript, D3.js

                  XYZ 소프트웨어 (2018.07 - 2021.02)
                  프론트엔드 개발자
                  - Angular 기반 대시보드 개발
                  기술: Angular, JavaScript, SCSS, RxJS

                  프로젝트:
                  1. 데이터 시각화 대시보드 (2019.03 - 2020.12)
                     - 실시간 데이터 처리 및 시각화 구현
                     - 기술: Angular, D3.js, RxJS
                  <end_of_example>
                  #### 프로젝트명 (시작일 - 종료일)
                  - 유형: 개인/팀/학교/동아리 프로젝트 중 1개 유형 선정
                  - 역할: 담당 역할
                  - 내용: 프로젝트 설명 및 성과 작성
                  - 사용 기술: 기술1, 기술2, 기술3
                  <end_format>
                - 사용 도구/기술 스택 목록: 사용자가 현재까지 사용한 도구, 프레임워크, 라이브러리, 언어 등을 말한다. 존재한다면, 해당 도구/스택의 이름 목록을 가져오고 직접 기입하지 않았다면, 경력사항도 살펴본다.
                  만약 추출된다면, 예시는 다음과 같을 것이다:
                   <start_of_example>
                  [ "Figma", "Sketch", "Zeplin", "Adobe Photoshop" ]
                  <end_of_example>
                """)
                        .apply(Map.of())
                        .toSystemMessage(),
                PromptTemplate.from(
                                """
                Observation: 이미지/문서에서 추출된 사용자의 이력서는 다음과 같습니다:
                {{content}}
                """)
                        .apply(Map.of("content", content))
                        .toUserMessage(),
                PromptTemplate.from(
                                """
                Thought: 이력서에서 추출해야 하는 항목을 분석이 끝났다.

                ```typescript
                type Resume = {
                  name: string | null // 사용자명
                  position: string | null // 직무
                  experience: string | null // 경력사항을 Markdown 문자열로 반환한다.
                  skillSet: string[] // 사용 도구/기술 스택의 이름을 각 문자열 아이템으로 배열로 반환한다.
                }
                ```

                정의된 타입스립트 형식을 준수하여 예시가 아닌 사용자의 이력서를 기반으로 반드시
                ```json
                $RESULT
                ```으로 감싸 완벽한 JSON을 최종 결과로 반환해야겠다.

                Final Result:
                ```json
                """)
                        .apply(Map.of("content", content))
                        .toAiMessage());

        System.out.println(prompts.stream().map(prompt -> prompt.text()).collect(Collectors.joining("\n")));

        var output = "```json\n" + model.chat(prompts).aiMessage().text();

        if (!output.endsWith("```")) {

            output = output + "\n```";
        }

        Matcher matcher = PATTERN.matcher(output);

        if (matcher.find()) {

            try {

                String found = matcher.group(1).trim();

                return mapper.readValue(found, Resume.class);
            } catch (JsonProcessingException e) {

                log.error(e.getMessage(), e.getCause());
            }
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to extracting a resume.");
    }
}
