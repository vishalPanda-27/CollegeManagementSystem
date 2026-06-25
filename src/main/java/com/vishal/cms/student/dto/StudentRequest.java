package com.vishal.cms.student.dto;

import com.vishal.cms.student.StudentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record StudentRequest(

        @NotBlank
        String rollNumber,

        @NotBlank
        String firstName,

        @NotBlank
        String lastName,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String phoneNumber,

        LocalDate dateOfBirth,

        @NotBlank
        String gender,

        String address,

        LocalDate admissionDate,

        StudentStatus status,

        @NotNull
        Long departmentId

) {
}