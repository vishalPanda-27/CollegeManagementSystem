package com.vishal.cms.course;

import com.vishal.cms.course.dto.CourseRequest;
import com.vishal.cms.course.dto.CourseResponse;
import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.CourseNotFoundException;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseMapper courseMapper;

    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }
    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(
                        () -> new CourseNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        return courseMapper.toResponse(course);
    }

    public Course findByCourseId(Long courseId) {
        return courseRepository.findById(courseId).orElseThrow(
                () -> new CourseNotFoundException("Course not found with id: " + courseId)
        );
    }

    public CourseResponse createCourse(CourseRequest request) {

        if (courseRepository.existsByCourseCode(
                request.getCourseCode()
        )) {
            throw new IllegalStateException(
                    "Course code already exists"
            );
        }

        Department department =
                departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(
                                () -> new DepartmentNotFoundException(
                                        "Department not found"
                                )
                        );

        Course course = courseMapper.toEntity(request, department);

        return courseMapper.toResponse(courseRepository.save(course));
    }

    public CourseResponse updateCourse(
            Long id,
            CourseRequest request
    ) {
        Course existing =
                courseRepository.findByCourseCode(
                        request.getCourseCode()
                ).orElse(null);

        if (
                existing != null &&
                        !existing.getId().equals(id)
        ) {
            throw new IllegalStateException(
                    "Course code already exists"
            );
        }

        Course course = courseRepository.findById(id)
                .orElseThrow(
                        () -> new CourseNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        Department department =
                departmentRepository.findById(
                        request.getDepartmentId()
                ).orElseThrow(
                        () -> new DepartmentNotFoundException(
                                "Department not found"
                        )
                );
        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCredits(request.getCredits());
        course.setSemester(request.getSemester());
        course.setDescription(request.getDescription());
        course.setDepartment(department);

        return courseMapper.toResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(
                        () -> new CourseNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        if (course.getEnrollments() != null && !course.getEnrollments().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete course with enrollments"
            );
        }

        courseRepository.delete(course);
    }

    public List<CourseResponse> getCoursesBySemester(Integer semester) {

        return courseRepository.findBySemester(semester)
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }

    public List<CourseResponse> getCoursesByDepartment(Long departmentId) {

        departmentRepository.findById(departmentId)
                .orElseThrow(
                        () -> new DepartmentNotFoundException(
                                "Department not found with id: " + departmentId
                        )
                );

        return courseRepository.findByDepartmentId(departmentId)
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }
}
