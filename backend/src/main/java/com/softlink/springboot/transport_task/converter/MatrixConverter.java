package com.softlink.springboot.transport_task.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.io.IOException;

@Converter(autoApply = true)
public class MatrixConverter implements AttributeConverter<int[][], JsonNode> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public JsonNode convertToDatabaseColumn(int[][] matrix) {
        try {
            return objectMapper.valueToTree(matrix);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert matrix to JsonNode", e);
        }
    }

    @Override
    public int[][] convertToEntityAttribute(JsonNode dbData) {
        try {
            return objectMapper.treeToValue(dbData, int[][].class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert JsonNode to matrix", e);
        }
    }
}