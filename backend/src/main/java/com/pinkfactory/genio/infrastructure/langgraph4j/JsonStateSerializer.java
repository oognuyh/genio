package com.pinkfactory.genio.infrastructure.langgraph4j;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.pinkfactory.genio.infrastructure.adapter.out.resume.ResumeExtractingGraph.State;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import org.bsc.langgraph4j.serializer.plain_text.jackson.JacksonStateSerializer;

/**
 * JsonStateSerializer is a class that extends JacksonStateSerializer for serializing and deserializing
 * the state of an AgentExecutor using JSON format.
 */
public class JsonStateSerializer extends JacksonStateSerializer<State> {

    /**
     * Constructs a new JSONStateSerializer and registers custom deserializers for various agent-related classes.
     */
    public JsonStateSerializer() {
        super(State::new);
        objectMapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
    }

    /**
     * Serializes the given AgentExecutor.State object to an output stream in JSON format.
     *
     * @param object the AgentExecutor.State object to serialize
     * @param out the output stream to write the serialized object to
     * @throws IOException if an I/O error occurs during serialization
     */
    @Override
    public void write(State object, ObjectOutput out) throws IOException {
        var json = objectMapper.writeValueAsString(object);
        out.writeUTF(json);
    }

    /**
     * Deserializes an AgentExecutor.State object from an input stream in JSON format.
     *
     * @param in the input stream to read the serialized object from
     * @return the deserialized AgentExecutor.State object
     * @throws IOException if an I/O error occurs during deserialization
     */
    @Override
    public State read(ObjectInput in) throws IOException {
        var json = in.readUTF();
        return objectMapper.readValue(json, State.class);
    }
}
