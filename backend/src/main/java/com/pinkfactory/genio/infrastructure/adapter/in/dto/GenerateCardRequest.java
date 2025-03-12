package com.pinkfactory.genio.infrastructure.adapter.in.dto;

import com.pinkfactory.genio.domain.Strength;
import com.pinkfactory.genio.domain.Tone;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Schema(description = "Card generation request parameters")
public record GenerateCardRequest(
        @Schema(description = "Name of the person", example = "John Doe") @NotBlank(message = "Name is required") String name,
        String englishName,
        @Schema(description = "Career stage of the person", example = "Junior") String stage,
        @Schema(description = "Job category of the person", example = "Development") String jobCategory,
        @Schema(description = "Current or most recent position", example = "Full Stack Developer")
                @NotBlank(message = "Position is required") String position,
        @Schema(
                        description = "List of key strengths",
                        example =
                                "[{\"value\":\"일을 한 번 시작하면 시간 가는 줄 모르고 집중해요.\"},{\"value\":\"동료나 상대방 입장에서 늘 생각하려고 노력해요.\"},{\"value\":\"변화에 빠르게 적응하고 새로운 방법을 많이 시도해봐요.\"}]")
                List<Strength> strengths,
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
                String experience,
        @Schema(
                        description = "Card generation purpose",
                        example =
                                "{ \"title\": \"열정적인\", \"description\": \"도전과 열정을 강조하고 싶을 때 좋아요!  *추천 대상: 취업 준비생, 강사, 스타트업 멤버\" }")
                Tone tone) {}
