package com.pinkfactory.genio.infrastructure.adapter.out.card;

import com.pinkfactory.genio.infrastructure.adapter.out.card.CardGeneratingGraph.State;
import java.util.Objects;
import org.bsc.langgraph4j.action.EdgeAction;

public class EvaluationRouter implements EdgeAction<State> {

    private static final int MAX_ITERATIONS = 5;

    @Override
    public String apply(State state) throws Exception {

        var evaluations = state.evaluations();
        var iterations = state.iterations();

        if (iterations >= MAX_ITERATIONS) {

            return "Continue";
        }

        var candidate =
                evaluations.stream().filter(Evaluation::shouldRevise).findAny().orElse(null);

        return Objects.isNull(candidate) ? "Continue" : candidate.field();
    }
}
