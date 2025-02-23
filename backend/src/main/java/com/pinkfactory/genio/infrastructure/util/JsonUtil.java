package com.pinkfactory.genio.infrastructure.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.victools.jsonschema.generator.SchemaGenerator;
import com.github.victools.jsonschema.generator.SchemaGeneratorConfigBuilder;
import com.github.victools.jsonschema.generator.SchemaVersion;
import io.github.haibiiin.json.repair.JSONRepair;
import lombok.experimental.UtilityClass;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh </a>
 */
@UtilityClass
public class JsonUtil {

    private static final JSONRepair repairer = new JSONRepair();

    private static final SchemaGenerator generator =
            new SchemaGenerator(new SchemaGeneratorConfigBuilder(SchemaVersion.DRAFT_2020_12).build());

    /**
     * Generates a schema from a target class.
     *
     * @param <T> A type to generate
     * @param target A target class to generate
     * @return The generated schema
     */
    public static <T> JsonNode getSchema(Class<T> target) {

        return generator.generateSchema(target);
    }

    /**
     * Repairs a JSON string.
     *
     * @param target A stringified JSON to repair
     * @return The repaired JSON string
     */
    public static String repairJson(String target) {

        return repairer.handle(target);
    }
}
