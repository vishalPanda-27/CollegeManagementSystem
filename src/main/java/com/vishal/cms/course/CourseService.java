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

    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(CourseMapper::toResponse)
                .toList();
    }
    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(
                        () -> new CourseNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        return CourseMapper.toResponse(course);
    }

    public Course findByCourseId(Long courseId) {
        return courseRepository.findById(courseId).orElseThrow(
                () -> new CourseNotFoundException("Course not found with id: " + courseId)
        );
    }

    public CourseResponse createCourse(CourseRequest request) {

        Department department =
                departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(
                                () -> new DepartmentNotFoundException(
                                        "Department not found"
                                )
                        );

        Course course = new Course();

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCredits(request.getCredits());
        course.setSemester(request.getSemester());
        course.setDescription(request.getDescription());
        course.setDepartment(department);

        return CourseMapper.toResponse(
                courseRepository.save(course)
        );
    }

    public CourseResponse updateCourse(
            Long id,
            CourseRequest request
    ) {

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
                        () -> new RuntimeException(
                                "Department not found"
                        )
                );

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCredits(request.getCredits());
        course.setSemester(request.getSemester());
        course.setDescription(request.getDescription());
        course.setDepartment(department);

        return CourseMapper.toResponse(
                courseRepository.save(course)
        );
    }

    public void deleteCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(
                        () -> new CourseNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        courseRepository.delete(course);
    }
}
