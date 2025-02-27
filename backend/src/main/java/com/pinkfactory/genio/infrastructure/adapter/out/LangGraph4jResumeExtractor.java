package com.pinkfactory.genio.infrastructure.adapter.out;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph;
import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import com.pinkfactory.genio.infrastructure.util.IDGenerator;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LangGraph4jResumeExtractor implements ResumeExtractor {

    private final ResumeExtractingGraph graph;

    @Override
    public Resume extract(String resumeId, String content) {

        var result = graph.build().stream(Map.of("resumeId", resumeId, "resume", content));

        State generation = new State(Map.of());

        for (var r : result) {

            generation = r.state();
        }

        return Resume.builder()
                .resumeId(IDGenerator.generate())
                .name(generation
                        .<String>value("name")
                        .map(name -> name.replace("null", ""))
                        .orElse(null))
                .jobCategory(generation
                        .<String>value("jobCategory")
                        .map(name -> name.replace("null", ""))
                        .orElse(null))
                .position(generation
                        .<String>value("position")
                        .map(name -> name.replace("null", ""))
                        .orElse(null))
                .experience(generation
                        .<String>value("experience")
                        .map(name -> name.replace("null", ""))
                        .orElse(null))
                .skillSet(generation.<List<String>>value("skillSet").orElse(Collections.emptyList()))
                .build();
    }
}
