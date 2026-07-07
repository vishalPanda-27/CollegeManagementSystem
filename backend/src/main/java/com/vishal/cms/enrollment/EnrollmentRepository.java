package com.vishal.cms.enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    boolean existsByStudent_IdAndCourse_Id(
            Long studentId,
            Long courseId
    );

    List<Enrollment> findByStudent_Id(Long studentId);

    List<Enrollment> findByCourse_Id(Long courseId);

    List<Enrollment> findByStatus(EnrollmentStatus status);

    List<Enrollment> findByStudent_IdAndStatus(
            Long studentId,
            EnrollmentStatus status
    );
}