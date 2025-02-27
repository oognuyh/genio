package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.samskivert.mustache.Mustache;
import dev.langchain4j.model.input.Prompt;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Map;
import org.springframework.util.ResourceUtils;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public class PromptTemplate extends dev.langchain4j.model.input.PromptTemplate {

    /**
     * Create a new PromptTemplate.
     *
     * <p>The {@code Clock} will be the system clock.</p>
     *
     * @param template the template string of the prompt.
     */
    public PromptTemplate(String template) {
        super(template);
    }

    @Override
    public Prompt apply(Object value) {

        return Prompt.from(Mustache.compiler()
                .emptyStringIsFalse(true)
                .defaultValue("")
                .compile(template())
                .execute(value));
    }

    @Override
    public Prompt apply(Map<String, Object> variables) {

        return this.apply((Object) variables);
    }

    public Prompt apply(ObjectNode variables) {

        return this.apply(JsonUtil.convert(variables, new TypeReference<Map<String, Object>>() {}));
    }

    public static PromptTemplate of(String template) {

        if (template.startsWith("classpath:")) {

            try {

                var path = ResourceUtils.getFile(template).toPath();

                return new PromptTemplate(Files.readString(path, Charset.defaultCharset()));
            } catch (IOException e) {

                throw new IllegalArgumentException(e);
            }
        }

        return new PromptTemplate(template);
    }
}
