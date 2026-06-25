package com.vishal.cms.enrollment.dto;

import com.vishal.cms.enrollment.EnrollmentStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EnrollmentRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long courseId;

    private LocalDate enrollmentDate;

    private String semester;

    @Pattern(
            regexp = "^\\d{4}-\\d{4}$",
            message = "Academic year must be in format YYYY-YYYY"
    )
    private String academicYear;

    private EnrollmentStatus status;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double grade;
}