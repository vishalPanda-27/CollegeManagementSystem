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
import com.vishal.cms.student.StudentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        if(student.getStatus() != StudentStatus.ACTIVE){
            throw new IllegalStateException(
                    "Inactive student cannot enroll"
            );
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course not found with id: "
                                        + request.getCourseId()));

        if (enrollmentRepository
                .existsByStudent_IdAndCourse_Id(
                        request.getStudentId(),
                        request.getCourseId())) {

            throw new IllegalStateException(
                    "Student is already enrolled in this course"
            );
        }

        Enrollment enrollment = enrollmentMapper.toEntity(request,student,course);
        return enrollmentMapper.toResponse(
                enrollmentRepository.save(enrollment)
        );
    }

    public List<EnrollmentResponse> getAllEnrollments() {

        return enrollmentRepository.findAll()
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    public EnrollmentResponse getEnrollmentById(
            Long enrollmentId
    ) {

        return enrollmentMapper.toResponse(
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
        Student student = studentRepository.findById(studentId).orElseThrow(
                ()-> new StudentNotFoundException("Student not found with id: "+studentId)
        );
        return enrollmentRepository
                .findByStudent_Id(student.getId())
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    public List<EnrollmentResponse> getEnrollmentsByCourse(
            Long courseId
    ) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                ()-> new CourseNotFoundException("Course not found with id: "+courseId)
        );
        return enrollmentRepository
                .findByCourse_Id(course.getId())
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
        if (request.getStatus() != null) {
            enrollment.setStatus(request.getStatus());
        }
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
                                "Enrollment not found with id: " + enrollmentId
                        ));
        if(enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Completed enrollment cannot be deleted");
        }
        if(enrollment.getStatus() == EnrollmentStatus.ENROLLED) {
            throw new IllegalStateException("Enrollment cannot be deleted");
        }

        enrollmentRepository.delete(enrollment);
    }


    public EnrollmentResponse dropEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id).orElseThrow(
                () -> new EnrollmentNotFoundException("Enrollment not found with id: " + id)
        );
        if (enrollment.getStatus() == EnrollmentStatus.DROPPED) {
            throw new IllegalStateException(
                    "Enrollment already dropped"
            );
        }
        if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Completed enrollment cannot be dropped"
            );
        }

        enrollment.setStatus(EnrollmentStatus.DROPPED);
        return enrollmentMapper.toResponse(enrollmentRepository.save(enrollment));
    }

    public EnrollmentResponse completeEnrollment(Long id) {

        Enrollment enrollment = enrollmentRepository.findById(id).orElseThrow(
                () -> new EnrollmentNotFoundException("Enrollment not found with id: " + id)
        );
        if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Enrollment already completed"
            );
        }
        if (
                enrollment.getStatus() == EnrollmentStatus.DROPPED ||
                        enrollment.getStatus() == EnrollmentStatus.WITHDRAWN
        ) {
            throw new IllegalStateException(
                    "Dropped enrollment cannot be completed"
            );
        }

        enrollment.setStatus(EnrollmentStatus.COMPLETED);
        return enrollmentMapper.toResponse(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentResponse> getEnrollmentsByStatus(EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status)
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    public List<EnrollmentResponse> getActiveEnrollmentsByStudent(Long studentId) {
        Student student=studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + studentId
                        ));
        return enrollmentRepository.findByStudent_IdAndStatus(
                        student.getId(),
                        EnrollmentStatus.ENROLLED
                )
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    public List<EnrollmentResponse> getCompletedEnrollmentsByStudent(Long studentId) {
        Student student=studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + studentId
                        ));
        return enrollmentRepository.findByStudent_IdAndStatus(
                student.getId(),
                EnrollmentStatus.COMPLETED
        )
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }
}