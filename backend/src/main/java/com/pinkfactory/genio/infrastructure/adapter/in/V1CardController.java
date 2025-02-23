package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.application.CardService;
import com.pinkfactory.genio.domain.Recommended;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.CardResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.CreateCardRequest;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1CardApiSpecification;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/cards")
public class V1CardController implements V1CardApiSpecification {

    private final CardService service;

    @Override
    @PostMapping
    public ResponseEntity<CardResponse> generateCard(@Valid @RequestBody CreateCardRequest request) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(CardResponse.builder()
                        .cardId("a9b7c243-2640-4d05-ab1c-84ac4f207678")
                        .slogan("Innovate Together, Grow Forever")
                        .introduction("We are a creative team dedicated to bringing your ideas to life")
                        .colors(List.of(Recommended.<String>builder()
                                .value("#FF5733")
                                .reason(
                                        "This vibrant orange represents energy and creativity, matching your company's innovative spirit")
                                .confidence(0.95)
                                .build()))
                        .build());
    }
}
