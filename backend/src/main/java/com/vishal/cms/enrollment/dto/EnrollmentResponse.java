package com.vishal.cms.enrollment.dto;

import com.vishal.cms.enrollment.EnrollmentStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class EnrollmentResponse {

    private Long enrollmentId;

    private Long studentId;
    private String studentName;

    private Long courseId;
    private String courseName;

    private LocalDate enrollmentDate;

    private String semester;

    private String academicYear;

    private EnrollmentStatus status;

    private Double grade;
}