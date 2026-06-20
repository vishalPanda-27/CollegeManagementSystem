package com.vishal.cms.department.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    private String description;

    @Email
    private String email;

    private String phoneNumber;
}