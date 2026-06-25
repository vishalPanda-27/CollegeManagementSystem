package com.vishal.cms.course.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    @Min(2)
    private Integer credits;

    @Min(1)
    @Max(8)
    private Integer semester;

    private String description;

    @NotNull
    private Long departmentId;
}