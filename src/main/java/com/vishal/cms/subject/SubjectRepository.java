package com.vishal.cms.subject;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    boolean existsBySubjectCode(String subjectCode);

    Optional<Subject> findBySubjectCode(String subjectCode);

    List<Subject> findByDepartment_Id(Long departmentId);

    List<Subject> findByCourse_Id(Long courseId);

    List<Subject> findByActive(Boolean active);

    long countByDepartment_Id(Long departmentId);

    long countByActive(Boolean active);
}