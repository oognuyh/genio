package com.pinkfactory.genio.infrastructure.adapter.out;

import com.pinkfactory.genio.domain.Resume;
import com.pinkfactory.genio.port.out.ResumeExtractor;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.input.PromptTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@Component
@RequiredArgsConstructor
public class SimpleResumeExtractor implements ResumeExtractor {

    private final ChatLanguageModel model;

    @Override
    public Resume extract(String content) {

        model.chat(PromptTemplate.from(content).apply(null).toSystemMessage());

        throw new UnsupportedOperationException("Unimplemented method 'extract'");
    }
}
