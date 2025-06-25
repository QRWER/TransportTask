package com.softlink.springboot.transport_task.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = IntMatrixValidator.class)
public @interface CheckIntMatrix {
    public int min() default 1;
    public String message() default "Значение поля должны быть больше 1";

    public Class<?>[] groups() default {};
    public Class<? extends Payload>[] payload() default {};
}
