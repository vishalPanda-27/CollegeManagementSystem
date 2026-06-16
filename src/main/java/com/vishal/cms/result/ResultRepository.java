package com.vishal.cms.result;

import com.vishal.cms.student.Student;
import com.vishal.cms.subject.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result,Long> {
    List<Result> findByStudent(Student student);

    List<Result> findBySubject(Subject subject);

    Optional<Result> findByStudentAndSubject(
            Student student,
            Subject subject
    );
}
