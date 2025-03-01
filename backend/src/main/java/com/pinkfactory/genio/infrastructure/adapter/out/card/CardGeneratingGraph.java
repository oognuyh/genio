package com.pinkfactory.genio.infrastructure.adapter.out.card;

import static org.bsc.langgraph4j.StateGraph.END;
import static org.bsc.langgraph4j.StateGraph.START;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.bsc.langgraph4j.CompiledGraph;
import org.bsc.langgraph4j.StateGraph;
import org.bsc.langgraph4j.action.AsyncNodeAction;
import org.bsc.langgraph4j.state.AgentState;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@RequiredArgsConstructor
public class CardGeneratingGraph {

    private final TaglineGenerator taglineGenerator;

    private final BiographyGenerator biographyGenerator;

    private final HashtagGenerator hashtagGenerator;

    private final ColorGenerator colorGenerator;

    public static class State extends AgentState {

        public State(Map<String, Object> initData) {
            super(initData);
        }

        public Resume resume() {

            return JsonUtil.deserialize(this.<String>value("resume").orElse("{}"), Resume.class);
        }
    }

    @SneakyThrows
    public CompiledGraph<State> build() {

        return new StateGraph<>(State::new)
                .addNode(TaglineGenerator.NAME, AsyncNodeAction.node_async(taglineGenerator))
                .addNode(BiographyGenerator.NAME, AsyncNodeAction.node_async(biographyGenerator))
                .addNode(HashtagGenerator.NAME, AsyncNodeAction.node_async(hashtagGenerator))
                .addNode(ColorGenerator.NAME, AsyncNodeAction.node_async(colorGenerator))
                .addEdge(START, TaglineGenerator.NAME)
                .addEdge(START, BiographyGenerator.NAME)
                .addEdge(START, HashtagGenerator.NAME)
                .addEdge(START, ColorGenerator.NAME)
                .addEdge(TaglineGenerator.NAME, END)
                .addEdge(BiographyGenerator.NAME, END)
                .addEdge(HashtagGenerator.NAME, END)
                .addEdge(ColorGenerator.NAME, END)
                .compile();
    }
}
