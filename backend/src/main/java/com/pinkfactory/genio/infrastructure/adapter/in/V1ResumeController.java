package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.application.ResumeService;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.ResumeResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1ResumeApiSpecification;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase.ExtractResumeCommand;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/resumes")
public class V1ResumeController implements V1ResumeApiSpecification {

    private final ResumeService service;

    @Override
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResumeResponse> extractResume(@RequestPart("file") MultipartFile file) {

        var command = ExtractResumeCommand.builder()
                .file(() -> {
                    try {

                        return file.getInputStream();
                    } catch (IOException e) {

                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
                    }
                })
                .build();

        service.extractResume(command);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResumeResponse.builder()
                        .resumeId("4fc2a0a8-8080-47be-b4be-a2e70e1fd329")
                        .skills(List.of("Java", "Spring Boot", "AWS", "Agile Development"))
                        .strengths(List.of("Problem Solving", "Team Leadership", "Strategic Thinking"))
                        .experiences(List.of(
                                "Senior Software Engineer at Tech Corp (2020-Present)",
                                "Software Developer at Innovation Inc (2018-2020)"))
                        .build());
    }
}
