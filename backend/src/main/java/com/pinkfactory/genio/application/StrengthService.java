package com.pinkfactory.genio.application;

import com.pinkfactory.genio.domain.Strength;
import com.pinkfactory.genio.port.in.FindStrengthsUseCase;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StrengthService implements FindStrengthsUseCase {

    @Override
    public List<Strength> findStrengths() {

        return List.of(
                Strength.builder().value("작은 실수도 놓치지 않고 세세한 부분까지 확인해요.").build(),
                Strength.builder().value("함께 의견을 나누며 일할 떄 더 좋은 결과를 만들어내요.").build(),
                Strength.builder().value("문제가 생기면 끝까지 해결하려고 깊이 파고들어요.").build(),
                Strength.builder().value("맡은 일을 끝내지 못하면 밤에 잠이 오지 않아요.").build(),
                Strength.builder().value("일을 한 번 시작하면 시간 가는 줄 모르고 집중해요.").build(),
                Strength.builder().value("동료나 상대방 입장에서 늘 생각하려고 노력해요.").build(),
                Strength.builder().value("변화에 빠르게 적응하고 새로운 방법을 많이 시도해봐요.").build());
    }
}
