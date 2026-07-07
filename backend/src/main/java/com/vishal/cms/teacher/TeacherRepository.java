package com.vishal.cms.teacher;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher,Long> {
    Optional<Teacher> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Teacher> findByDepartment_Id(Long departmentId);

    List<Teacher> findByActive(boolean active);

    long countByDepartment_Id(Long departmentId);

    long countByActive(boolean active);

}
