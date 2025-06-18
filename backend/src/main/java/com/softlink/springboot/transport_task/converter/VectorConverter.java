package com.softlink.springboot.transport_task.converter;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import com.fasterxml.jackson.databind.ObjectMapper;

@Converter
public class VectorConverter implements AttributeConverter<int[], JsonNode> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public JsonNode convertToDatabaseColumn(int[] vector) {
        try {
            return objectMapper.valueToTree(vector);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert vector to JSON", e);
        }
    }

    @Override
    public int[] convertToEntityAttribute(JsonNode dbData) {
        try {
            return objectMapper.treeToValue(dbData, int[].class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to vector", e);
        }
    }
}
