package com.pinkfactory.genio.infrastructure.adapter.out.resume;

import static org.bsc.langgraph4j.StateGraph.END;
import static org.bsc.langgraph4j.StateGraph.START;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.bsc.langgraph4j.CompiledGraph;
import org.bsc.langgraph4j.StateGraph;
import org.bsc.langgraph4j.action.AsyncNodeAction;
import org.bsc.langgraph4j.state.AgentState;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Primary
@Component
@RequiredArgsConstructor
public class ResumeExtractingGraph {

    private final PersonalInformationExtractor personalInformationExtractor;

    private final SkillSetExtractor skillSetExtractor;

    private final ResumeEvaluator resumeEvaluator;

    private final ExperienceExtractor experienceExtractor;

    public static class State extends AgentState {

        @JsonCreator
        public State(@JsonProperty("initData") Map<String, Object> initData) {
            super(Objects.requireNonNullElse(initData, Collections.emptyMap()));
        }

        public List<Evaluation> evaluations() {

            var evaluations = this.<String>value("evaluations").orElse("[]");

            return JsonUtil.deserialize(evaluations, new TypeReference<>() {});
        }

        public int iterations() {

            return this.<Integer>value("iterations").orElse(0);
        }
    }

    @SneakyThrows
    public CompiledGraph<State> build() {

        return new StateGraph<>(State::new)
                .addNode(PersonalInformationExtractor.NAME, AsyncNodeAction.node_async(personalInformationExtractor))
                .addNode(SkillSetExtractor.NAME, AsyncNodeAction.node_async(skillSetExtractor))
                .addNode(ExperienceExtractor.NAME, AsyncNodeAction.node_async(experienceExtractor))
                .addNode(ResumeEvaluator.NAME, AsyncNodeAction.node_async(resumeEvaluator))
                .addEdge(START, PersonalInformationExtractor.NAME)
                .addEdge(PersonalInformationExtractor.NAME, SkillSetExtractor.NAME)
                .addEdge(SkillSetExtractor.NAME, ExperienceExtractor.NAME)
                .addEdge(ExperienceExtractor.NAME, END)
                //                .addEdge(PersonalInformationExtractor.NAME, ResumeEvaluator.NAME)
                //                .addEdge(SkillSetExtractor.NAME, ResumeEvaluator.NAME)
                //                .addEdge(ExperienceExtractor.NAME, ResumeEvaluator.NAME)
                //                .addConditionalEdges(
                //                        ResumeEvaluator.NAME,
                //                        AsyncEdgeAction.edge_async(new EvaluationRouter()),
                //                        Map.of(
                //                                "Continue",
                //                                END,
                //                                "name",
                //                                PersonalInformationExtractor.NAME,
                //                                "jobCategory",
                //                                PersonalInformationExtractor.NAME,
                //                                "position",
                //                                PersonalInformationExtractor.NAME,
                //                                "experience",
                //                                ExperienceExtractor.NAME,
                //                                "skillSet",
                //                                SkillSetExtractor.NAME))
                .compile();
    }
}
