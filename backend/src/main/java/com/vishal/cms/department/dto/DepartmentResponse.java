package com.vishal.cms.department.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DepartmentResponse {

    private Long id;

    private String code;

    private String name;

    private String description;

    private String email;

    private String phoneNumber;

    private Long hodId;

    private String hodName;

    private Integer totalStudents;

    private Integer totalTeachers;

    private Integer totalCourses;

    private Integer totalPrograms;

    private Integer totalClassrooms;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}