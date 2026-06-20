package com.vishal.cms.teacher.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class TeacherRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    private String email;

    @NotBlank
    private String phone;

    private String qualification;

    private String specialization;

    private LocalDate joiningDate;

    private Double salary;

    private boolean active;

    private Long departmentId;

    private Long userId;

    private Set<Long> subjectIds;

    private Set<Long> courseIds;
}