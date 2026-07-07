package com.vishal.cms.student.dto;

import com.vishal.cms.student.StudentStatus;

import java.time.LocalDate;

public record StudentResponse(

        Long id,

        String rollNumber,

        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        LocalDate dateOfBirth,

        String gender,

        String address,

        LocalDate admissionDate,

        StudentStatus status,

        Long departmentId,

        String departmentName

) {
}