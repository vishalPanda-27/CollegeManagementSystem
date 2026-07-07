package com.vishal.cms.enrollment;

import com.vishal.cms.course.Course;
import com.vishal.cms.enrollment.dto.EnrollmentRequest;
import com.vishal.cms.enrollment.dto.EnrollmentResponse;
import com.vishal.cms.student.Student;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EnrollmentMapper {
    public Enrollment toEntity(EnrollmentRequest request, Student student, Course course) {
        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(course);
        enrollment.setStudent(student);
        enrollment.setEnrollmentDate(
                request.getEnrollmentDate() == null
                        ? LocalDate.now()
                        : request.getEnrollmentDate()
        );
        enrollment.setSemester(request.getSemester());
        if (request.getAcademicYear() == null) {
            int year = LocalDate.now().getYear();
            enrollment.setAcademicYear(year + "-" + (year + 1));
        } else {
            enrollment.setAcademicYear(request.getAcademicYear());
        }
        enrollment.setStatus(
                request.getStatus() == null
                        ? EnrollmentStatus.ENROLLED
                        : request.getStatus()
        );
        enrollment.setGrade(request.getGrade());
        return enrollment;
    }

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