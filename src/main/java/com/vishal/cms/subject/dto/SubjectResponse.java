package com.vishal.cms.subject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {

    private Long id;

    private String subjectCode;

    private String subjectName;

    private Integer credits;

    private Integer theoryHours;

    private Integer practicalHours;

    private Integer semester;

    private Boolean active;

    private Long departmentId;
    private String departmentName;

    private Long courseId;
    private String courseName;
}