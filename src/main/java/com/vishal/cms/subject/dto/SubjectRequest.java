package com.vishal.cms.subject.dto;

import jakarta.validation.constraints.Max;
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

    @NotNull
    @Min(2)
    private Integer credits;

    @NotNull
    @Min(1)
    private Integer theoryHours;

    private Integer practicalHours;

    @NotNull
    @Min(1)
    @Max(8)
    private Integer semester;

    private Boolean active = true;

    @NotNull
    private Long departmentId;

    @NotNull
    private Long courseId;
}