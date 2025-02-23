package com.pinkfactory.genio.infrastructure.langgraph4j;

import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class Reactor extends Agent {

    protected Reactor(ChatLanguageModel model, List<ToolSpecification> tools) {
        super(model, tools);
    }
}
