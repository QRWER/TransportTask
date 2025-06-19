package com.softlink.springboot.transport_task.entity;

import com.softlink.springboot.transport_task.converter.MatrixConverter;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.Reference;

import java.util.Arrays;

@Entity
public class Solution {

    @Id
    private int id;

    @Convert(converter = MatrixConverter.class)
    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private int[][] solution;

    @Column
    private int cost;

    public Solution(int id, int[][] solution, int cost) {
        this.id = id;
        this.solution = solution;
        this.cost = cost;
    }

    public Solution(int[][] solution, int cost) {
        this.solution = solution;
        this.cost = cost;
    }

    public Solution() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int[][] getSolution() {
        return solution;
    }

    public void setSolution(int[][] solution) {
        this.solution = solution;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    @Override
    public String toString() {
        return "Solution{" +
                "id=" + id +
                ", solution=" + Arrays.toString(solution) +
                ", cost=" + cost +
                '}';
    }
}
