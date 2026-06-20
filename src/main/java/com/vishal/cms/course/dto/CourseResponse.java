package com.vishal.cms.course.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {

    private Long id;

    private String courseCode;

    private String courseName;

    private Integer credits;

    private Integer semester;

    private String description;

    private Long departmentId;

    private String departmentName;
}