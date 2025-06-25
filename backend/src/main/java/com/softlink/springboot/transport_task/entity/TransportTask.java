package com.softlink.springboot.transport_task.entity;
import com.softlink.springboot.transport_task.converter.MatrixConverter;
import com.softlink.springboot.transport_task.converter.VectorConverter;
import com.softlink.springboot.transport_task.validator.CheckIntArray;
import com.softlink.springboot.transport_task.validator.CheckIntMatrix;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @CheckIntMatrix(min = 1, message = "Значения Matrix должны быть больше 1")
    private int[][] matrix;

    @Convert(converter = VectorConverter.class)
    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    @CheckIntArray(min = 1, message = "Значения Supplies должны быть больше 1")
    private int[] supplies;

    @Convert(converter = VectorConverter.class)
    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    @CheckIntArray(min = 1, message = "Значения Needs должны быть больше 1")
    private int[] needs;

    private void checkSuppliesSize(int[][] matrix, int[] supplies) {
        if(matrix.length != supplies.length) throw new ArrayStoreException("Matrix length doesn't match with Supplies length");
    }

    private void checkNeedsSize(int[][] matrix, int[] needs) {
        for (int[] vector : matrix) {
            if (vector.length != needs.length)
                throw new ArrayStoreException("Matrix length doesn't match with Needs length");
        }
    }

    public TransportTask(int[][] matrix, int[] supplies, int[] needs) {
        checkSuppliesSize(matrix, supplies);
        checkNeedsSize(matrix, needs);
        this.matrix = matrix;
        this.supplies = supplies;
        this.needs = needs;
    }

    public TransportTask(int id, int[][] matrix, int[] supplies, int[] needs) {
        checkSuppliesSize(matrix, supplies);
        checkNeedsSize(matrix, needs);
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
        if(supplies!=null) checkSuppliesSize(matrix, supplies);
        if(needs!=null) checkNeedsSize(matrix, needs);
        this.matrix = matrix;
    }

    public int[] getSupplies() {
        return supplies;
    }

    public void setSupplies(int[] supplies) {
        if(matrix != null) checkSuppliesSize(matrix, supplies);
        this.supplies = supplies;
    }

    public int[] getNeeds() {
        return needs;
    }

    public void setNeeds(int[] needs) {
        if(matrix != null) checkNeedsSize(matrix, needs);
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
