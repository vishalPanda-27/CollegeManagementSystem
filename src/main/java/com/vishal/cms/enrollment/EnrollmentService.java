package com.vishal.cms.enrollment;

import com.vishal.cms.course.Course;
import com.vishal.cms.course.CourseRepository;
import com.vishal.cms.exceptions.CourseNotFoundException;
import com.vishal.cms.exceptions.EnrollmentNotFoundException;
import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public Enrollment createEnrollment(
            Long studentId,
            Long courseId,
            Enrollment enrollment
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException("Student not found with id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new CourseNotFoundException("Course not found with id: " + courseId));

        if (enrollmentRepository
                .existsByStudentIdAndCourseId(
                        studentId,
                        courseId
                )) {

            throw new IllegalStateException(
                    "Student is already enrolled in this course"
            );
        }

        enrollment.setStudent(student);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Enrollment getEnrollmentById(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() ->
                        new EnrollmentNotFoundException(
                                "Enrollment not found with id: " + enrollmentId
                        ));
    }

    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Enrollment updateEnrollment(
            Long enrollmentId,
            Enrollment updatedEnrollment
    ) {

        Enrollment enrollment = getEnrollmentById(enrollmentId);

        enrollment.setSemester(updatedEnrollment.getSemester());
        enrollment.setAcademicYear(updatedEnrollment.getAcademicYear());
        enrollment.setStatus(updatedEnrollment.getStatus());
        enrollment.setGrade(updatedEnrollment.getGrade());

        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long enrollmentId) {

        Enrollment enrollment = getEnrollmentById(enrollmentId);

        enrollmentRepository.delete(enrollment);
    }
}