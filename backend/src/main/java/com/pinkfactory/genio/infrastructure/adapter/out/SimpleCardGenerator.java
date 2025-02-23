package com.pinkfactory.genio.infrastructure.adapter.out;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.pinkfactory.genio.domain.Card;
import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.port.out.CardGenerator;
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
public class SimpleCardGenerator implements CardGenerator {

    private final ChatLanguageModel model;

    private final JsonMapper mapper;

    private static final Pattern PATTERN = Pattern.compile("```json\\s*\\n(.*?)```", Pattern.DOTALL);

    @Override
    public Card generate(Resume resume, String tone) {

        var prompts = List.of(
                PromptTemplate.from(
                                """
                        # 역할 및 목적
                        당신은 이력서 데이터를 기반으로 개인의 브랜딩 카드를 생성하는 전문 에이전트입니다. 주어진 이력서 정보를 분석하여 그 사람의 특징을 잘 나타내는 매력적인 카드를 만들어내야 합니다.

                        # 입력 데이터 구조
                        입력으로 다음과 같은 이력서 데이터가 제공됩니다:
                        - name: 이름
                        - position: 현재 또는 희망 직무
                        - strengths: 강점 목록
                        - skills: 보유 기술 목록
                        - experiences: 경력 사항 목록
                        - tone: 카드의 전반적인 톤앤매너를 결정하는 스타일 지정자

                        # Tone 종류와 특징
                        - RECRUITMENT: 채용을 위한 공식적인 이력서 카드
                          - 실무 경험과 전문성 강조
                          - 구체적인 성과와 기술 스택 중심
                          - 업계 표준 용어 사용
                          - 예: "Spring/JPA 기반 백엔드 시스템 설계 및 운영 경험을 보유한 Java 개발자"

                        - NETWORKING: 인맥 형성과 커리어 PR을 위한 카드
                          - 커리어 스토리와 관심사 강조
                          - 협업 스타일과 성장 가능성 부각
                          - 개성있는 표현 허용
                          - 예: "사용자 관점의 문제 해결에 집중하는 백엔드 개발자"

                        - FREELANCE: 프리랜서/계약직 구인을 위한 카드
                          - 즉시 투입 가능한 역량 강조
                          - 구체적인 프로젝트 경험 나열
                          - 전문 분야 집중 부각
                          - 예: "대규모 트래픽 처리와 시스템 안정화를 전문으로 하는 백엔드 개발자"

                        - PERSONAL_BRANDING: 일반적인 자기 PR용 카드
                          - 차별화된 가치관과 철학 강조
                          - 장기적 비전과 관심사 포함
                          - 부드러운 어조 사용
                          - 예: "지속 가능한 코드 설계에 가치를 두는 백엔드 개발자"

                        # 출력 데이터 구조
                        다음 구조의 카드 데이터를 생성해야 합니다:
                        - cardId: 카드 고유 식별자 (resumeId를 기반으로 생성)
                        - tagline: 그 사람을 한 문장으로 표현하는 캐치프레이즈
                        - biography: 그 사람의 이야기를 담은 짧은 소개글
                        - colors: 그 사람의 이미지에 어울리는 추천 컬러 목록
                        - hashtags: 프로필을 표현하는 핵심 키워드를 해시태그 형태로 나열

                        # 세부 처리 규칙
                        ## 1. Tagline 생성 규칙
                        - position과 주요 strength를 결합하여 매력적인 문구 생성
                        - 간결하고 기억에 남는 표현 사용
                        - 전문성과 개성이 동시에 드러나도록 구성
                        - 비유와 은유적인 표현을 결합

                        예시:
                        - "혁신적인 솔루션을 만드는 백엔드 엔지니어"
                        - "사용자 중심의 UX에 진심인 프로덕트 디자이너"

                        ## 2. Biography 생성 규칙
                        - strengths, skills, experiences를 자연스럽게 통합하여 tone을 고려한 스토리텔링
                        - 200자 이내로 서술
                        - 성과나 수치보다는 관점과 가치를 중심으로 서술
                        - 현재형 시제 사용

                        예시:
                        "기술로 사회 문제를 해결하는 것에 깊은 관심을 가지고 있는 개발자입니다. 5년간의 헬스케어 분야 경험을 통해 안정적이고 확장성 있는 시스템 설계를 추구해왔습니다. 클린 코드와 지속적인 학습을 통해 더 나은 서비스를 만들어가는 것을 즐깁니다."

                        ## 3. Colors 추천 규칙
                        - strength와 position을 기반으로 그 사람의 이미지에 어울리는 색상 선정
                        - 3가지 색상 조합 추천
                        - 각 색상별로 선정 이유 명시
                        - #HEX 형식으로 추천

                        ## 4. 색상 선정 기준
                        - 리더십/추진력 → 강렬한 레드, 다크 블루 계열
                        - 창의성/혁신 → 밝은 오렌지, 퍼플 계열
                        - 안정성/신뢰성 → 네이비, 그레이 계열
                        - 성장/발전 → 그린, 터콰이즈 계열
                        - 감성/공감 → 소프트 핑크, 스카이 블루 계열

                        ## 5. 해시태그 생성 규칙
                        - position, skills, strengths를 기반으로 주요 키워드 추출
                        - #tag 형태로 작성 (#JavaDeveloper, #CloudArchitect)
                        - 전문 분야 태그 (예: #BackendDeveloper #SystemArchitect)
                        - 기술 스택 태그 (예: #SpringBoot #Kubernetes #AWS)
                        - 전문성/강점 태그 (예: #ProblemSolver #AgileLeader)
                        - 각 태그별로 선정 이유 명시

                        ### 주의사항:
                        - 최대 5개의 핵심적인 해시태그만 선정
                        - 범용적인 태그는 지양 (#Developer, #Professional 등)
                        - 구체적이고 차별화된 키워드 선정

                        # 품질 검증 기준
                        - 모든 필수 필드가 채워져 있는가?
                        - Tagline이 차별성과 매력도를 가지는가?
                        - Biography가 자연스럽고 설득력 있는가?
                        - 선정된 Colors가 전체적인 이미지와 조화를 이루는가?
                        - 전반적으로 일관된 톤앤매너를 유지하는가?
                        - 구체적이고 차별화된 태그들을 추출하였는가?
                        """)
                        .apply(Map.of())
                        .toSystemMessage(),
                PromptTemplate.from(
                                """
                        Observation: 이력서 내용은 다음과 같다:
                        {{resume}}
                        """)
                        .apply(Map.of("resume", resume))
                        .toUserMessage(),
                PromptTemplate.from(
                                """
                        Thought: 카드를 생성하기 위한 모든 준비는 끝났다.

                        ```typescript
                        type Card = {
                            tagline: String;
                            biography: String;
                            color: Recommended<string>[];
                            hashtags: Recommended<string>[];
                        }

                        type Recommended<T> = {
                            value: T;
                            confidence: number;
                            reason: string;
                        }
                        ```

                        정의된 타입스립트 형식을 준수하여 반드시
                        ```json
                        $RESULT
                        ```으로 감싸 완벽한 JSON을 최종 결과로 반환해야겠다.

                        Final Result:
                        ```json
                        """)
                        .apply(Map.of())
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

                return mapper.readValue(found, Card.class);
            } catch (JsonProcessingException e) {

                log.error(e.getMessage(), e.getCause());
            }
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generating a card.");
    }
}
