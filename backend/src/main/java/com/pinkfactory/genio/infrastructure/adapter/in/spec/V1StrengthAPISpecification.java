package com.pinkfactory.genio.infrastructure.adapter.in.spec;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.StrengthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;

@SuppressWarnings("unused")
@Tag(name = "Strength V1", description = "Strengths management API")
public interface V1StrengthAPISpecification {

    @Operation(summary = "Get all strengths", description = "Retrieve all strengths")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Strengths successfully retrieved",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = StrengthResponse.class)))
            })
    ResponseEntity<List<StrengthResponse>> findStrengths();
}
