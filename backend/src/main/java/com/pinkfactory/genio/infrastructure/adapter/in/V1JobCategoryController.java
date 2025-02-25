package com.pinkfactory.genio.infrastructure.adapter.in;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.JobCategoryResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.spec.V1JobCategoryAPISpecification;
import com.pinkfactory.genio.port.in.FindJobCategoriesUseCase;
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
@RequestMapping("/api/v1/job-categories")
public class V1JobCategoryController implements V1JobCategoryAPISpecification {

    private final FindJobCategoriesUseCase useCase;

    @Override
    @GetMapping
    public ResponseEntity<List<JobCategoryResponse>> findJobCategories() {

        return ResponseEntity.status(HttpStatus.OK)
                .body(useCase.findJobCategories().stream()
                        .map(category -> JobCategoryResponse.builder()
                                .name(category.name())
                                .positions(category.positions())
                                .skillSet(category.skillSet())
                                .build())
                        .toList());
    }
}
