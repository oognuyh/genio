package com.pinkfactory.genio.infrastructure.adapter.in.spec;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.ToneResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;

@SuppressWarnings("unused")
@Tag(name = "Tone V1", description = "Tones management API")
public interface V1ToneAPISpecification {

    @Operation(summary = "Get all tones", description = "Retrieve all tones")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Tones successfully retrieved",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = ToneResponse.class)))
            })
    ResponseEntity<List<ToneResponse>> findTones();
}
