package com.vishal.cms.student.dto;

import com.vishal.cms.student.StudentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record StudentRequest(

        @NotBlank
        String rollNumber,

        @NotBlank
        String firstName,

        @NotBlank
        String lastName,

        @Email
        String email,

        String phoneNumber,

        LocalDate dateOfBirth,

        String gender,

        String address,

        LocalDate admissionDate,

        StudentStatus status,

        Long departmentId

) {
}