package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Builder
@Schema(description = "Resume response")
public record ResumeResponse(
        @Schema(description = "Generated resume identifier", example = "4fc2a0a8-8080-47be-b4be-a2e70e1fd329")
                String resumeId,
        @Schema(description = "Extracted name from resume", example = "John Doe") String name,
        String jobCategory,
        String englishName,
        String stage,
        @Schema(description = "Current or most recent position", example = "Backend Developer") String position,
        @Schema(
                        description = "List of technical and professional skill set",
                        example = "[\"Java\", \"Spring Boot\", \"AWS\", \"Agile Development\"]")
                List<String> skillSet,
        @Schema(
                        description = "Work experience",
                        example =
                                """
            경력사항
            ABC 테크놀로지 (2021.03 - 현재)
            수석 프론트엔드 개발자
            - React와 TypeScript를 사용한 웹 애플리케이션 개발
            - 마이크로프론트엔드 아키텍처 설계 및 구현
            - 주니어 개발자 멘토링 및 코드 리뷰
            - 사용자 경험 최적화로 페이지 로딩 시간 30% 단축
            기술: React, TypeScript, Redux, Webpack, Jest

            프로젝트:
            1. 대시보드 리뉴얼 (2022.05 - 2022.12)
               - 기존 레거시 대시보드를 React로 마이그레이션
               - 사용자 인터랙션 개선으로 전환율 15% 상승
               - 기술: React, TypeScript, D3.js

            2. 마이크로프론트엔드 아키텍처 구축 (2021.06 - 2021.12)
               - Module Federation을 활용한 마이크로프론트엔드 설계
               - 다양한 팀의 독립적 개발 환경 구축
               - 기술: Webpack 5, Module Federation, React

            XYZ 소프트웨어 (2018.07 - 2021.02)
            프론트엔드 개발자
            - Angular 기반 대시보드 개발
            - RESTful API 연동 및 상태 관리
            - UI 컴포넌트 라이브러리 구축
            기술: Angular, JavaScript, SCSS, RxJS

            프로젝트:
            1. 데이터 시각화 대시보드 (2019.03 - 2020.12)
               - 실시간 데이터 처리 및 시각화 구현
               - 다양한 차트 및 그래프 컴포넌트 개발
               - 기술: Angular, D3.js, RxJS
            """)
                String experience) {}
