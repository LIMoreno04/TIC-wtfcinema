package com.um.edu.uy.entities.validators;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = FunctionDateTimeValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFunctionDateTime {
    String message() default "La fecha y hora de la función no puede estar en el pasado";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

