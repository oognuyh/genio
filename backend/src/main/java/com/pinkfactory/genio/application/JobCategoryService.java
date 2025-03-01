package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.JobCategory;
import com.pinkfactory.genio.port.in.FindJobCategoriesUseCase;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class JobCategoryService implements FindJobCategoriesUseCase {

    @Override
    public List<JobCategory> findJobCategories() {

        return List.of(
                JobCategory.builder()
                        .name("기획")
                        .positions(List.of("서비스 기획자", "PO/PM", "사업 기획자"))
                        .skillSet(List.of(
                                "서비스 전략",
                                "유저 리서치",
                                "정보 구조화(IA)",
                                "Figma",
                                "Sketch",
                                "데이터 분석",
                                "Jira",
                                "Confluence",
                                "애자일 방법론",
                                "스크럼",
                                "칸반",
                                "제품 로드맵",
                                "OKR",
                                "KPI",
                                "MVP",
                                "시장 분석",
                                "비즈니스 모델링"))
                        .build(),
                JobCategory.builder()
                        .name("디자인")
                        .positions(List.of("프로덕트 디자이너", "UI/UX 디자이너", "웹 디자이너", "그래픽 디자이너", "콘텐츠 디자이너", "브랜드 디자이너"))
                        .skillSet(List.of(
                                "Figma",
                                "Sketch",
                                "Adobe XD",
                                "Photoshop",
                                "Illustrator",
                                "InDesign",
                                "프로토타이핑",
                                "유저 리서치",
                                "와이어프레임",
                                "디자인 시스템",
                                "타이포그래피",
                                "컬러 이론",
                                "웹 표준",
                                "반응형 디자인",
                                "After Effects",
                                "Premier Pro"))
                        .build(),
                JobCategory.builder()
                        .name("개발")
                        .positions(List.of(
                                "백엔드 개발자",
                                "웹 프론트엔드 개발자",
                                "풀스택 개발자",
                                "앱 개발자",
                                "웹 퍼블리셔",
                                "DevOps 엔지니어",
                                "DBA",
                                "QA 엔지니어",
                                "개발 PM/PL",
                                "보안 엔지니어",
                                "하드웨어 엔지니어",
                                "펌웨어 엔지니어",
                                "임베디드 SW 엔지니어",
                                "임베디드 HW 엔지니어",
                                "로보틱스 엔지니어",
                                "블록체인 개발자"))
                        .skillSet(List.of(
                                "Java",
                                "Python",
                                "JavaScript",
                                "TypeScript",
                                "React",
                                "Vue",
                                "Angular",
                                "Spring",
                                "Node.js",
                                "Django",
                                "Express",
                                "HTML",
                                "CSS",
                                "AWS",
                                "Docker",
                                "Kubernetes",
                                "Git",
                                "MySQL",
                                "PostgreSQL",
                                "MongoDB",
                                "RESTful API",
                                "GraphQL",
                                "Swift",
                                "Kotlin",
                                "React Native",
                                "Flutter",
                                "CI/CD",
                                "Jenkins",
                                "GitHub Actions",
                                "Terraform",
                                "Linux",
                                "SQL",
                                "NoSQL",
                                "Jira",
                                "Selenium",
                                "JUnit",
                                "C/C++",
                                "Ethereum"))
                        .build(),
                JobCategory.builder()
                        .name("마케팅")
                        .positions(List.of("마케터"))
                        .skillSet(List.of(
                                "디지털 마케팅",
                                "콘텐츠 마케팅",
                                "소셜 미디어 마케팅",
                                "SEO",
                                "SEM",
                                "Google Analytics",
                                "퍼포먼스 마케팅",
                                "CRM",
                                "그로스 해킹",
                                "A/B 테스트",
                                "마케팅 자동화",
                                "이메일 마케팅",
                                "브랜드 전략",
                                "광고 집행",
                                "Google Ads",
                                "Facebook Ads"))
                        .build(),
                JobCategory.builder()
                        .name("AI/데이터")
                        .positions(List.of(
                                "데이터 분석가",
                                "데이터 사이언티스트",
                                "데이터 엔지니어",
                                "데이터 애널리틱스 엔지니어",
                                "데이터 플랫폼 엔지니어",
                                "AI 개발자",
                                "머신러닝 엔지니어",
                                "MLOps 엔지니어",
                                "DataOps 엔지니어"))
                        .skillSet(List.of(
                                "Python",
                                "R",
                                "SQL",
                                "Pandas",
                                "NumPy",
                                "TensorFlow",
                                "PyTorch",
                                "Spark",
                                "Hadoop",
                                "Airflow",
                                "Kafka",
                                "ETL",
                                "통계 분석",
                                "데이터 시각화",
                                "Tableau",
                                "PowerBI",
                                "머신러닝",
                                "딥러닝",
                                "NLP",
                                "컴퓨터 비전",
                                "강화학습",
                                "MLOps",
                                "Big Data",
                                "데이터 파이프라인",
                                "특성 공학"))
                        .build());
    }
}
