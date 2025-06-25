package com.softlink.springboot.transport_task.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IntMatrixValidator implements ConstraintValidator<CheckIntMatrix, int[][]> {

    private int min;

    @Override
    public void initialize(CheckIntMatrix constraintAnnotation) {
        min = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(int[][] array, ConstraintValidatorContext constraintValidatorContext) {
        for(int[] i: array)
            for(int j: i)
                if(j < min) return false;
        return true;
    }
}