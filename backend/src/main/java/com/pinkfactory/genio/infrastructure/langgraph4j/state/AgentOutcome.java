package com.pinkfactory.genio.infrastructure.langgraph4j.state;

/**
 * Represents the outcome of an agent's action.
 *
 * @param action the action taken by the agent
 * @param finish the finish state of the agent
 */
public record AgentOutcome(AgentAction action, AgentFinish finish) {}
