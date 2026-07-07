package com.vishal.cms.student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRollNumber(String rollNumber);

    List<Student> findByDepartment_Id(Long departmentId);

    List<Student> findByStatus(StudentStatus status);

    long countByDepartment_Id(Long departmentId);

    long countByStatus(StudentStatus status);
}