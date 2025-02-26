package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.application.CardService;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.CardResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.GenerateCardRequest;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1CardAPISpecification;
import com.pinkfactory.genio.port.in.GenerateCardUseCase.GenerateCardCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/cards")
public class V1CardController implements V1CardAPISpecification {

    private final CardService service;

    @Override
    @PostMapping
    public ResponseEntity<CardResponse> generateCard(@Valid @RequestBody GenerateCardRequest request) {

        var command = GenerateCardCommand.builder()
                .name(request.name())
                .position(request.position())
                .skillSet(request.skillSet())
                .experiences(request.experiences())
                .strengths(request.strengths())
                .tone(request.tone())
                .build();

        var card = service.generateCard(command);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CardResponse.builder()
                        .cardId(card.cardId())
                        .tagline(card.tagline())
                        .biography(card.biography())
                        .hashtags(card.hashtags())
                        .colors(card.colors())
                        .build());
    }
}
