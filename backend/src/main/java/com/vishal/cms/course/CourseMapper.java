package com.vishal.cms.course;

import com.vishal.cms.course.dto.CourseRequest;
import com.vishal.cms.course.dto.CourseResponse;
import com.vishal.cms.department.Department;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    public Course toEntity(
            CourseRequest request,
            Department department
    ) {

        Course course = new Course();

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCredits(request.getCredits());
        course.setSemester(request.getSemester());
        course.setDescription(request.getDescription());
        course.setDepartment(department);

        return course;
    }

    public CourseResponse toResponse(Course course) {

        return CourseResponse.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .credits(course.getCredits())
                .semester(course.getSemester())
                .description(course.getDescription())
                .departmentId(
                        course.getDepartment() != null
                                ? course.getDepartment().getId()
                                : null
                )
                .departmentName(
                        course.getDepartment() != null
                                ? course.getDepartment().getName()
                                : null
                )
                .build();
    }
}