package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.ToneResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1ToneAPISpecification;
import com.pinkfactory.genio.port.in.FindTonesUseCase;
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
@RequestMapping("/api/v1/tones")
public class V1ToneController implements V1ToneAPISpecification {

    private final FindTonesUseCase useCase;

    @Override
    @GetMapping
    public ResponseEntity<List<ToneResponse>> findTones() {

        return ResponseEntity.status(HttpStatus.OK)
                .body(useCase.findTones().stream()
                        .map(tone -> ToneResponse.builder()
                                .title(tone.title())
                                .description(tone.description())
                                .build())
                        .toList());
    }
}
