package com.vishal.cms.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);

    List<Course> findBySemester(Integer semester);

    List<Course> findByDepartmentId(Long departmentId);
}
