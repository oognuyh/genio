package com.pinkfactory.genio.infrastructure.adapter.out.card;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class Evaluation {

    private String field;

    private boolean shouldRevise;

    private String feedback;
}
