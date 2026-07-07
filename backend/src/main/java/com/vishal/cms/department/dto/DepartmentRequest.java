package com.vishal.cms.department.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DepartmentRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    private String description;

    @Email
    private String email;

    @NotBlank
    private String phoneNumber;
}