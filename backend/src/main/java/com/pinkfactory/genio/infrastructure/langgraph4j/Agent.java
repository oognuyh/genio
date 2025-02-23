package com.pinkfactory.genio.infrastructure.langgraph4j;

import com.pinkfactory.genio.infrastructure.langgraph4j.state.AgentAction;
import com.pinkfactory.genio.infrastructure.langgraph4j.state.IntermediateStep;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.ToolExecutionResultMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.request.ChatRequestParameters;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public abstract class Agent {

    protected final ChatLanguageModel model;

    protected final List<ToolSpecification> tools;

    protected Agent(ChatLanguageModel model, List<ToolSpecification> tools) {
        this.model = model;
        this.tools = tools;
    }

    /**
     * Prepares a list of chat messages based on the input and intermediate steps.
     *
     * @param input the input string to process.
     * @param intermediateSteps a list of intermediate steps to consider.
     * @return a list of prepared chat messages.
     */
    private List<ChatMessage> prepareMessages(String input, List<IntermediateStep> intermediateSteps) {
        var userMessageTemplate = PromptTemplate.from("{{input}}").apply(Map.of("input", input));

        var messages = new ArrayList<ChatMessage>();

        messages.add(new SystemMessage("You are a helpful assistant"));
        messages.add(new UserMessage(userMessageTemplate.text()));

        if (!intermediateSteps.isEmpty()) {

            var toolRequests = intermediateSteps.stream()
                    .map(IntermediateStep::action)
                    .map(AgentAction::toolExecutionRequest)
                    .collect(Collectors.toList());

            messages.add(new AiMessage(toolRequests)); // reply with tool requests

            for (IntermediateStep step : intermediateSteps) {
                var toolRequest = step.action().toolExecutionRequest();

                messages.add(new ToolExecutionResultMessage(toolRequest.id(), toolRequest.name(), step.observation()));
            }
        }

        return messages;
    }

    /**
     * Executes the agent's action based on the input and intermediate steps, returning a response.
     *
     * @param input the input string to process.
     * @param intermediateSteps a list of intermediate steps to consider.
     * @return a response containing the generated AI message.
     */
    public ChatResponse execute(String input, List<IntermediateStep> intermediateSteps) {

        Objects.requireNonNull(model, "chatLanguageModel is required!");

        return model.chat(ChatRequest.builder()
                .messages(prepareMessages(input, intermediateSteps))
                .parameters(ChatRequestParameters.builder()
                        .toolSpecifications(tools)
                        .build())
                .build());
    }
}
