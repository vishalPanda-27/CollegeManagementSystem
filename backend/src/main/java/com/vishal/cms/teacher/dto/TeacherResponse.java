package com.vishal.cms.teacher.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
public class TeacherResponse {

    private Long teacherId;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String qualification;

    private String specialization;

    private LocalDate joiningDate;

    private Double salary;

    private boolean active;

    private Long departmentId;

    private String departmentName;

    private Long userId;

    private Set<Long> subjectIds;

    private Set<Long> courseIds;
}