package com.pinkfactory.genio.infrastructure.adapter.in.spec;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.JobCategoryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;

@SuppressWarnings("unused")
@Tag(name = "Job categories V1", description = "Job categories management API")
public interface V1JobCategoryAPISpecification {

    @Operation(summary = "Get all job categories", description = "Retrieve all job categories with their positions")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Job categories successfully retrieved",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = JobCategoryResponse.class)))
            })
    ResponseEntity<List<JobCategoryResponse>> findJobCategories();
}
