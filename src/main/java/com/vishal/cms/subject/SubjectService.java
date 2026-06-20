package com.vishal.cms.subject;

import com.vishal.cms.course.Course;
import com.vishal.cms.course.CourseRepository;
import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.CourseNotFoundException;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.SubjectNotFoundException;
import com.vishal.cms.subject.dto.SubjectRequest;
import com.vishal.cms.subject.dto.SubjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectMapper subjectMapper;

    public List<SubjectResponse> findAll() {

        return subjectRepository.findAll()
                .stream()
                .map(subjectMapper::toResponse)
                .toList();
    }

    public SubjectResponse findById(Long id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new SubjectNotFoundException(
                                "Subject not found with id: " + id
                        ));

        return subjectMapper.toResponse(subject);
    }

    public SubjectResponse createSubject(
            SubjectRequest request
    ) {

        if (subjectRepository.existsBySubjectCode(
                request.getSubjectCode())) {

            throw new IllegalStateException(
                    "Subject code already exists"
            );
        }

        Department department =
                departmentRepository.findById(
                                request.getDepartmentId())
                        .orElseThrow(() ->
                                new DepartmentNotFoundException(
                                        "Department not found"));

        Course course =
                courseRepository.findById(
                                request.getCourseId())
                        .orElseThrow(() ->
                                new CourseNotFoundException(
                                        "Course not found"));

        Subject subject =
                subjectMapper.toEntity(
                        request,
                        department,
                        course
                );

        return subjectMapper.toResponse(
                subjectRepository.save(subject)
        );
    }

    public SubjectResponse updateSubject(
            Long id,
            SubjectRequest request
    ) {

        Subject subject =
                subjectRepository.findById(id)
                        .orElseThrow(() ->
                                new SubjectNotFoundException(
                                        "Subject not found with id: " + id));

        Department department =
                departmentRepository.findById(
                                request.getDepartmentId())
                        .orElseThrow(() ->
                                new DepartmentNotFoundException(
                                        "Department not found"));

        Course course =
                courseRepository.findById(
                                request.getCourseId())
                        .orElseThrow(() ->
                                new CourseNotFoundException(
                                        "Course not found"));

        subjectMapper.updateEntity(
                subject,
                request,
                department,
                course
        );

        return subjectMapper.toResponse(
                subjectRepository.save(subject)
        );
    }

    public void deleteSubject(Long id) {

        Subject subject =
                subjectRepository.findById(id)
                        .orElseThrow(() ->
                                new SubjectNotFoundException(
                                        "Subject not found with id: " + id));

        subjectRepository.delete(subject);
    }
}