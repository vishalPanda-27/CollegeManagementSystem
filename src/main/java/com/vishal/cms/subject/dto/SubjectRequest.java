package com.vishal.cms.subject.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubjectRequest {

    @NotBlank
    private String subjectCode;

    @NotBlank
    private String subjectName;

    @Min(1)
    private Integer credits;

    private Integer theoryHours;

    private Integer practicalHours;

    private Integer semester;

    private Boolean active = true;

    @NotNull
    private Long departmentId;

    @NotNull
    private Long courseId;
}