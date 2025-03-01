package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Tone;
import com.pinkfactory.genio.port.in.FindTonesUseCase;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ToneService implements FindTonesUseCase {

    @Override
    public List<Tone> findTones() {

        return List.of(
                Tone.builder()
                        .title("열정적인")
                        .description("도전과 열정을 강조하고 싶을 때 좋아요!  *추천 대상: 취업 준비생, 강사, 스타트업 멤버")
                        .build(),
                Tone.builder()
                        .title("진정성 있는")
                        .description("진솔함과 신뢰를 전하고 싶을 때 선택하세요!  *추천 대상: 프리랜서, 개인 브랜드 대표")
                        .build(),
                Tone.builder()
                        .title("창의적인")
                        .description("나만의 개성을 보여주고 싶을 때 잘 어울려요!  *추천 대상: 크리에이터, 디자이너, 콘텐츠 제작자")
                        .build(),
                Tone.builder()
                        .title("전문적인")
                        .description("실력과 전문성을 강조하고 싶을 때 적합해요!  *추천 대상: 경력직, 컨설턴트, 프리랜서")
                        .build(),
                Tone.builder()
                        .title("친근한")
                        .description("편안하고 다가가기 쉬운 이미지를 원할 때 추천해요!  *추천 대상: 대학생, 동아리 활동, 커뮤니티 활동")
                        .build());
    }
}
