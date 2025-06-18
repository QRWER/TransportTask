package com.softlink.springboot.transport_task.entity;
import com.softlink.springboot.transport_task.converter.MatrixConverter;
import com.softlink.springboot.transport_task.converter.VectorConverter;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Arrays;

@Entity
public class TransportTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Convert(converter = MatrixConverter.class)
    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private int[][] matrix;

    @Convert(converter = VectorConverter.class)
    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private int[] supplies;

    @Convert(converter = VectorConverter.class)
    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private int[] needs;

    public TransportTask(int[][] matrix, int[] supplies, int[] needs) {
        this.matrix = matrix;
        this.supplies = supplies;
        this.needs = needs;
    }

    public TransportTask(int id, int[][] matrix, int[] supplies, int[] needs) {
        this.id = id;
        this.matrix = matrix;
        this.supplies = supplies;
        this.needs = needs;
    }

    public TransportTask() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int[][] getMatrix() {
        return matrix;
    }

    public void setMatrix(int[][] matrix) {
        this.matrix = matrix;
    }

    public int[] getSupplies() {
        return supplies;
    }

    public void setSupplies(int[] supplies) {
        this.supplies = supplies;
    }

    public int[] getNeeds() {
        return needs;
    }

    public void setNeeds(int[] needs) {
        this.needs = needs;
    }

    @Override
    public String toString() {
        return "TransportTask{" +
                "id=" + id +
                ", matrix=" + Arrays.toString(matrix) +
                ", supplies=" + Arrays.toString(supplies) +
                ", needs=" + Arrays.toString(needs) +
                '}';
    }
}
