package com.pinkfactory.genio.infrastructure.util;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.github.victools.jsonschema.generator.SchemaGenerator;
import com.github.victools.jsonschema.generator.SchemaGeneratorConfigBuilder;
import com.github.victools.jsonschema.generator.SchemaVersion;
import com.github.victools.jsonschema.module.jackson.JacksonModule;
import io.github.haibiiin.json.repair.JSONRepair;
import io.github.haibiiin.json.repair.JSONRepairConfig;
import lombok.experimental.UtilityClass;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
@UtilityClass
public class JsonUtil {

    private static final JSONRepair repairer;

    private static final SchemaGeneratorConfigBuilder builder;

    private static final SchemaGenerator generator;

    private static final JsonMapper binder = JsonMapper.builder()
            .enable(JsonReadFeature.ALLOW_TRAILING_COMMA)
            .enable(JsonReadFeature.ALLOW_SINGLE_QUOTES)
            .visibility(PropertyAccessor.FIELD, Visibility.ANY)
            .visibility(PropertyAccessor.GETTER, Visibility.ANY)
            .build();

    static {
        builder = new SchemaGeneratorConfigBuilder(SchemaVersion.DRAFT_2019_09).with(new JacksonModule());

        builder.forFields()
                .withDefaultResolver(field -> {
                    if (field.isFakeContainerItemScope()) {

                        return null;
                    }

                    JsonProperty annotation = field.getAnnotation(JsonProperty.class);

                    return annotation == null || annotation.defaultValue().isEmpty() ? null : annotation.defaultValue();
                })
                .withNullableCheck(field -> false)
                .withRequiredCheck(field -> {
                    JsonProperty annotation = field.getAnnotation(JsonProperty.class);

                    return annotation != null && annotation.required();
                });

        builder.forMethods()
                .withIgnoreCheck(method -> method.getName().startsWith("get")
                        || method.getName().startsWith("set")
                        || method.getName().startsWith("builder")
                        || method.getName().endsWith("Builder")
                        || method.getName().equals("canEqual")
                        || method.getName().equals("equals")
                        || method.getName().equals("hashCode")
                        || method.getName().equals("toString")
                        || method.getName().equals("main")
                        || method.getName().startsWith("$default"));

        generator = new SchemaGenerator(builder.build());

        var config = new JSONRepairConfig();
        config.enableExtractJSON();
        repairer = new JSONRepair(config);
    }

    /**
     * Generates a schema from the given target class.
     *
     * @param <T> The type to generate
     * @param target The target class to generate the schema from
     * @return The generated schema
     */
    public static <T> JsonNode getSchema(Class<T> target) {

        return generator.generateSchema(target);
    }

    /**
     * Repairs the given JSON string.
     *
     * @param target The stringified JSON to repair
     * @return The repaired JSON string
     */
    public static String repairJson(String target) {

        return repairer.handle(target);
    }

    public static String serialize(Object target) {

        try {

            return binder.writeValueAsString(target);
        } catch (JsonProcessingException e) {

            throw new IllegalArgumentException(e);
        }
    }

    public static <T> T deserialize(String value, Class<T> valueType) {

        try {

            return binder.readValue(value, valueType);
        } catch (JsonProcessingException e) {

            throw new IllegalArgumentException(e);
        }
    }

    public static <T> T deserialize(String value, TypeReference<T> valueTypeRef) {

        try {

            return binder.readValue(value, valueTypeRef);
        } catch (JsonProcessingException e) {

            throw new IllegalArgumentException(e);
        }
    }

    public static <I, O> O convert(I value, Class<O> valueType) {

        return binder.convertValue(value, valueType);
    }

    public static <I, O> O convert(I value, TypeReference<O> valueTypeRef) {

        return binder.convertValue(value, valueTypeRef);
    }
}
