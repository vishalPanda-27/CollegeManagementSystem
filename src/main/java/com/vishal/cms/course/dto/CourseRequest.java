package com.vishal.cms.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    private Integer credits;

    private Integer semester;

    private String description;

    @NotNull
    private Long departmentId;
}