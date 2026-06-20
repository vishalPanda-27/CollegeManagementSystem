package com.vishal.cms.course;

import com.vishal.cms.course.dto.CourseResponse;

public class CourseMapper {

    private CourseMapper() {}

    public static CourseResponse toResponse(Course course) {

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