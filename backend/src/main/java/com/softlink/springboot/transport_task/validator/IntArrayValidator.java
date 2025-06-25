package com.softlink.springboot.transport_task.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IntArrayValidator implements ConstraintValidator<CheckIntArray, int[]> {

    private int min;

    @Override
    public void initialize(CheckIntArray constraintAnnotation) {
        min = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(int[] array, ConstraintValidatorContext constraintValidatorContext) {
        for(int i: array)
            if(i < min) return false;
        return true;
    }
}
