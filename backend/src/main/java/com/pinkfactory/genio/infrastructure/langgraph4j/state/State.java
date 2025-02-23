package com.pinkfactory.genio.infrastructure.langgraph4j.state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.bsc.langgraph4j.state.AgentState;
import org.bsc.langgraph4j.state.AppenderChannel;
import org.bsc.langgraph4j.state.Channel;

/** Represents the state of an agent. */
public class State extends AgentState {
    static Map<String, Channel<?>> schema =
            Map.of("intermediate_steps", AppenderChannel.<IntermediateStep>of(ArrayList::new));

    /**
     * Constructs a new State with the given initialization data.
     *
     * @param initData the initialization data
     */
    public State(Map<String, Object> initData) {
        super(initData);
    }

    /**
     * Retrieves the input value.
     *
     * @return an Optional containing the input value if present
     */
    public Optional<String> input() {
        return value("input");
    }

    /**
     * Retrieves the agent outcome.
     *
     * @return an Optional containing the agent outcome if present
     */
    public Optional<AgentOutcome> agentOutcome() {
        return value("agent_outcome");
    }

    /**
     * Retrieves the list of intermediate steps.
     *
     * @return a list of intermediate steps
     */
    public List<IntermediateStep> intermediateSteps() {
        return this.<List<IntermediateStep>>value("intermediate_steps").orElseGet(ArrayList::new);
    }
}
