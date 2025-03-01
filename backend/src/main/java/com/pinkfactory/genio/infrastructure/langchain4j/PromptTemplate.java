package com.pinkfactory.genio.infrastructure.langchain4j;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pinkfactory.genio.infrastructure.util.JsonUtil;
import com.samskivert.mustache.Mustache;
import dev.langchain4j.model.input.Prompt;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Map;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.util.FileCopyUtils;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public class PromptTemplate extends dev.langchain4j.model.input.PromptTemplate {

    private static final String CLASSPATH = "classpath:";

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

        if (template.startsWith(CLASSPATH)) {

            try {
                var path = template.substring(CLASSPATH.length());
                var resourceLoader = new DefaultResourceLoader();
                var resource = resourceLoader.getResource(CLASSPATH + path);

                try (var reader = new InputStreamReader(resource.getInputStream(), Charset.defaultCharset())) {
                    return new PromptTemplate(FileCopyUtils.copyToString(reader));
                }
            } catch (IOException e) {

                throw new IllegalArgumentException(e);
            }
        }

        return new PromptTemplate(template);
    }
}
