package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.application.ResumeService;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.ResumeResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1ResumeAPISpecification;
import com.pinkfactory.genio.port.in.ExtractResumeUseCase.ExtractResumeCommand;
import java.io.IOException;
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
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/resumes")
public class V1ResumeController implements V1ResumeAPISpecification {

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

        var resume = service.extractResume(command);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResumeResponse.builder()
                        .resumeId(resume.resumeId())
                        .name(resume.name())
                        .jobCategory(resume.jobCategory())
                        .stage(resume.stage())
                        .position(resume.position())
                        .skillSet(resume.skillSet())
                        .experience(resume.experience())
                        .build());
    }
}
