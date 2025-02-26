package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.StrengthResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1StrengthAPISpecification;
import com.pinkfactory.genio.port.in.FindStrengthsUseCase;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/strengths")
public class V1StrengthController implements V1StrengthAPISpecification {

    private final FindStrengthsUseCase useCase;

    @Override
    @GetMapping
    public ResponseEntity<List<StrengthResponse>> findStrengths() {

        return ResponseEntity.status(HttpStatus.OK)
                .body(useCase.findStrengths().stream()
                        .map(strength -> StrengthResponse.builder()
                                .value(strength.value())
                                .build())
                        .toList());
    }
}
