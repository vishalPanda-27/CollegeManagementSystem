package com.vishal.cms.enrollment;

import com.vishal.cms.course.Course;
import com.vishal.cms.course.CourseRepository;
import com.vishal.cms.enrollment.dto.EnrollmentRequest;
import com.vishal.cms.enrollment.dto.EnrollmentResponse;
import com.vishal.cms.exceptions.CourseNotFoundException;
import com.vishal.cms.exceptions.EnrollmentNotFoundException;
import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentResponse createEnrollment(
            EnrollmentRequest request
    ) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + request.getStudentId()));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course not found with id: "
                                        + request.getCourseId()));

        if (enrollmentRepository
                .existsByStudentIdAndCourseId(
                        request.getStudentId(),
                        request.getCourseId())) {

            throw new IllegalStateException(
                    "Student is already enrolled in this course"
            );
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(
                request.getEnrollmentDate() == null
                        ? LocalDate.now()
                        : request.getEnrollmentDate()
        );
        enrollment.setSemester(request.getSemester());
        enrollment.setAcademicYear(request.getAcademicYear());
        enrollment.setStatus(request.getStatus());
        enrollment.setGrade(request.getGrade());

        return enrollmentMapper.toResponse(
                enrollmentRepository.save(enrollment)
        );
    }

    public List<EnrollmentResponse> getAllEnrollments() {

        return enrollmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EnrollmentResponse getEnrollmentById(
            Long enrollmentId
    ) {

        return mapToResponse(
                enrollmentRepository.findById(enrollmentId)
                        .orElseThrow(() ->
                                new EnrollmentNotFoundException(
                                        "Enrollment not found with id: "
                                                + enrollmentId
                                ))
        );
    }

    public List<EnrollmentResponse> getEnrollmentsByStudent(
            Long studentId
    ) {

        return enrollmentRepository
                .findByStudentId(studentId)
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    public List<EnrollmentResponse> getEnrollmentsByCourse(
            Long courseId
    ) {

        return enrollmentRepository
                .findByCourseId(courseId)
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    public EnrollmentResponse updateEnrollment(
            Long enrollmentId,
            EnrollmentRequest request
    ) {

        Enrollment enrollment = enrollmentRepository
                .findById(enrollmentId)
                .orElseThrow(() ->
                        new EnrollmentNotFoundException(
                                "Enrollment not found with id: "
                                        + enrollmentId
                        ));

        enrollment.setSemester(request.getSemester());
        enrollment.setAcademicYear(request.getAcademicYear());
        enrollment.setStatus(request.getStatus());
        enrollment.setGrade(request.getGrade());

        return enrollmentMapper.toResponse(
                enrollmentRepository.save(enrollment)
        );
    }

    public void deleteEnrollment(Long enrollmentId) {

        Enrollment enrollment = enrollmentRepository
                .findById(enrollmentId)
                .orElseThrow(() ->
                        new EnrollmentNotFoundException(
                                "Enrollment not found with id: "
                                        + enrollmentId
                        ));

        enrollmentRepository.delete(enrollment);
    }

    private EnrollmentResponse mapToResponse(
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