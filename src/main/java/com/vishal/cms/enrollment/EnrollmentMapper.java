package com.vishal.cms.enrollment;

import com.vishal.cms.enrollment.dto.EnrollmentResponse;
import org.springframework.stereotype.Component;

@Component
public class EnrollmentMapper {

    public EnrollmentResponse toResponse(
            Enrollment enrollment
    ) {

        return EnrollmentResponse.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .studentId(
                        enrollment.getStudent().getId()
                )
                .studentName(
                        enrollment.getStudent().getFirstName()
                                + " "
                                + enrollment.getStudent().getLastName()
                )
                .courseId(
                        enrollment.getCourse().getId()
                )
                .courseName(
                        enrollment.getCourse().getCourseName()
                )
                .enrollmentDate(
                        enrollment.getEnrollmentDate()
                )
                .semester(
                        enrollment.getSemester()
                )
                .academicYear(
                        enrollment.getAcademicYear()
                )
                .status(
                        enrollment.getStatus()
                )
                .grade(
                        enrollment.getGrade()
                )
                .build();
    }
}