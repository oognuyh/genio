package com.pinkfactory.genio.infrastructure.adapter.in.spec;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.ResumeResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Resumes V1", description = "Resume management API")
public interface V1ResumeAPISpecification {

    @Operation(summary = "Extract resume data", description = "Extract structured data from resume PDF file")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Resume successfully extracted",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ResumeResponse.class)))
            })
    ResponseEntity<ResumeResponse> extractResume(
            @Schema(format = "binary", description = "Resume PDF file to extract data from") MultipartFile file);
}
