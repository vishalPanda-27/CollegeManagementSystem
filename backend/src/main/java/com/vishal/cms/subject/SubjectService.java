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
        if (
                !course.getDepartment()
                        .getId()
                        .equals(department.getId())
        ) {
            throw new IllegalStateException(
                    "Course does not belong to department"
            );
        }
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
        Subject existing =
                subjectRepository.findBySubjectCode(
                        request.getSubjectCode()
                ).orElse(null);

        if (
                existing != null &&
                        !existing.getId().equals(id)
        ) {
            throw new IllegalStateException(
                    "Subject code already exists"
            );
        }

        if (
                !course.getDepartment()
                        .getId()
                        .equals(department.getId())
        ) {
            throw new IllegalStateException(
                    "Course does not belong to department"
            );
        }

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

        if (!subject.getResults().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete subject with results"
            );
        }
        if (!subject.getAttendanceRecords().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete subject with attendance records"
            );
        }
        if (!subject.getTimetables().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete subject with timetables"
            );
        }
        if (!subject.getSchedules().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete subject with schedules"
            );
        }
        if (!subject.getTeachers().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete subject with teachers"
            );
        }

        subjectRepository.delete(subject);
    }

    public List<SubjectResponse> getSubjectsByDepartment(Long departmentId) {
        departmentRepository.findById(departmentId).orElseThrow(
                () ->new DepartmentNotFoundException("Department not found with id : " + departmentId)
        );

        return subjectRepository.findByDepartment_Id(departmentId)
                .stream()
                .map(subjectMapper::toResponse)
                .toList();
    }

    public List<SubjectResponse> getSubjectsByCourse(Long courseId) {
        courseRepository.findById(courseId).orElseThrow(
                () ->new CourseNotFoundException("Course not found with id : " + courseId)
        );
        return subjectRepository.findByCourse_Id(courseId)
                .stream()
                .map(subjectMapper::toResponse)
                .toList();
    }

    public SubjectResponse activateSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(
                        () ->new SubjectNotFoundException("Subject not found with id: " + id)
                );
        subject.setActive(true);
        subjectRepository.save(subject);
        return subjectMapper.toResponse(subject);
    }

    public SubjectResponse deactivateSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(
                        () ->new SubjectNotFoundException("Subject not found with id: " + id)
                );
        subject.setActive(false);
        subjectRepository.save(subject);
        return subjectMapper.toResponse(subject);
    }
    public long countSubjects() {
        return subjectRepository.count();
    }

    public long countSubjectsByDepartment(Long departmentId) {
        return subjectRepository.countByDepartment_Id(departmentId);
    }

    public long countActiveSubjects() {
        return subjectRepository.countByActive(true);
    }

    public long countInactiveSubjects() {
        return subjectRepository.countByActive(false);
    }

    public List<SubjectResponse> getActiveSubjects(){
        return subjectRepository.findByActive(true)
                .stream()
                .map(subjectMapper::toResponse)
                .toList();
    }

    public List<SubjectResponse> getInactiveSubjects() {
        return subjectRepository.findByActive(false)
                .stream()
                .map(subjectMapper::toResponse)
                .toList();
    }
}