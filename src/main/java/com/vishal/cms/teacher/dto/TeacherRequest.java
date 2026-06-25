package com.vishal.cms.teacher.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class TeacherRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String qualification;

    @NotBlank
    private String specialization;

    private LocalDate joiningDate = LocalDate.now();

    @Positive
    private Double salary;

    private boolean active=true;

    @NotNull
    private Long departmentId;

    private Long userId;

    private Set<Long> subjectIds;

    private Set<Long> courseIds;


}