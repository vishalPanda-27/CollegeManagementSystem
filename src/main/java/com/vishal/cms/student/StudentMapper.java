package com.vishal.cms.student;

import com.vishal.cms.department.Department;
import com.vishal.cms.student.dto.StudentRequest;
import com.vishal.cms.student.dto.StudentResponse;

public class StudentMapper {

    private StudentMapper() {
    }

    public static Student toEntity(
            StudentRequest request,
            Department department
    ) {

        Student student = new Student();

        student.setRollNumber(request.rollNumber());
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setEmail(request.email());
        student.setPhoneNumber(request.phoneNumber());
        student.setDateOfBirth(request.dateOfBirth());
        student.setGender(request.gender());
        student.setAddress(request.address());
        student.setAdmissionDate(request.admissionDate());
        student.setStatus(request.status());
        student.setDepartment(department);

        return student;
    }

    public static StudentResponse toResponse(
            Student student
    ) {

        return new StudentResponse(
                student.getId(),
                student.getRollNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getPhoneNumber(),
                student.getDateOfBirth(),
                student.getGender(),
                student.getAddress(),
                student.getAdmissionDate(),
                student.getStatus(),

                student.getDepartment() != null
                        ? student.getDepartment().getId()
                        : null,

                student.getDepartment() != null
                        ? student.getDepartment().getName()
                        : null
        );
    }
}