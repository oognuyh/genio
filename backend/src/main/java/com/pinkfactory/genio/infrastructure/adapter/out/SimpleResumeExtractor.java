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
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SimpleResumeExtractor implements ResumeExtractor {

    private final ChatLanguageModel model;

    private final JsonMapper mapper;

    private static final Pattern PATTERN = Pattern.compile("```json\\s*\\n(.*?)```", Pattern.DOTALL);

    @Override
    public Resume extract(String content) {

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
                - 이름: 사용자명으로 보통 상단에 존재한다.
                - 직무: 사용자의 직무로 사용자가 직접 기입한 것을 최우선으로 없다면, 최근 경력사항도 살펴본다.
                - 경력사항: 일반적으로 회사, 재직 기간, 수행한 프로젝트 목록, 그리고 해당 프로젝트 속 나의 역할과 문제 해결 능력을 기입한다. 있다면 마크다운 문자열로 전부 가져온다.
                  만약 추출된다면, 다음과 같을 것이다:
                  [ "### Artbox Studio (2023.04 - 현재)\n\n주요 업무\n- 웹/앱 서비스의 UI/UX 디자인 및 프로토타입 제작\n- 디자인 시스템 구축 및 컴포넌트 라이브러리 제작\n- 사용자 리서치 및 사용성 테스트 진행\n- Figma 기반 디자인 워크플로우 개선\n\n여행 예약 앱 리디자인 (2023.10 - 2023.12)\n- 사용자 여정 지도 작성 및 페인포인트 분석\n- 예약 프로세스 단계 최적화로 전환율 25% 향상\n- 모바일 앱 UI 키트 제작\n- 프로토타입 제작 및 사용성 테스트 진행",
                  "### Daily UI Challenge (2023.06 - 현재)\n\n- 100일간 매일 UI 요소 디자인 진행\n- 디자인 포트폴리오 웹사이트 제작\n- Dribbble에서 주간 인기 작품 선정\n- Instagram 디자인 계정 운영 (팔로워 2,000+)",
                  "### UX 리서치 스터디 그룹 운영 (2023.07 - 현재)\n\n- 월 1회 UX 케이스 스터디 진행\n- 업계 실무자 초청 세미나 기획\n- UX 리서치 방법론 가이드 문서 작성\n- 디자인 시스템 워크샵 진행" ]
                - 사용 도구/기술 스택 목록: 사용자가 현재까지 사용한 도구, 프레임워크, 라이브러리, 언어 등을 말한다. 존재한다면, 해당 도구/스택의 이름 목록을 가져오고 직접 기입하지 않았다면, 경력사항도 살펴본다.
                  만약 추출된다면, 다음과 같을 것이다:
                  [ "Figma", "Sketch", "Zeplin", "Adobe Photoshop" ]
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
                  name: string? // 사용자명
                  position: string? // 직무
                  experiences: string[] // 경력사항을 각 회사 단위로 프로젝트를 그룹화하여 Markdown 문자열로 아이템을 배열로 반환한다.
                  skills: string[] // 사용 도구/기술 스택의 이름을 각 문자열 아이템으로 배열로 반환한다.
                }
                ```

                정의된 타입스립트 형식을 준수하여 반드시
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

                System.out.println(found);

                return mapper.readValue(found, Resume.class);
            } catch (JsonProcessingException e) {

                log.error(e.getMessage(), e.getCause());
            }
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to extracting a resume.");
    }
}
