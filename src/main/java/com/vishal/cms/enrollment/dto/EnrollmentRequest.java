package com.vishal.cms.enrollment.dto;

import com.vishal.cms.enrollment.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;
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

    private String academicYear;

    private EnrollmentStatus status;

    private Double grade;
}