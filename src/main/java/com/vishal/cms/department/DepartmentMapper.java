package com.vishal.cms.department;

import com.vishal.cms.department.Department;
import com.vishal.cms.department.dto.DepartmentRequest;
import com.vishal.cms.department.dto.DepartmentResponse;
import com.vishal.cms.teacher.Teacher;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequest request) {

        Department department = new Department();

        department.setCode(request.getCode());
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setEmail(request.getEmail());
        department.setPhoneNumber(request.getPhoneNumber());

        return department;
    }

    public DepartmentResponse toResponse(Department department) {

        Teacher hod = department.getHod();

        return DepartmentResponse.builder()
                .id(department.getId())
                .code(department.getCode())
                .name(department.getName())
                .description(department.getDescription())
                .email(department.getEmail())
                .phoneNumber(department.getPhoneNumber())
                .hodId(hod != null ? hod.getTeacherId() : null)
                .hodName(
                        hod != null
                                ? hod.getFirstName() + " " + hod.getLastName()
                                : null
                )
                .totalStudents(
                        department.getStudents() != null
                                ? department.getStudents().size()
                                : 0
                )
                .totalTeachers(
                        department.getTeachers() != null
                                ? department.getTeachers().size()
                                : 0
                )
                .totalCourses(
                        department.getCourses() != null
                                ? department.getCourses().size()
                                : 0
                )
                .totalPrograms(
                        department.getPrograms() != null
                                ? department.getPrograms().size()
                                : 0
                )
                .totalClassrooms(
                        department.getClassrooms() != null
                                ? department.getClassrooms().size()
                                : 0
                )
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .build();
    }
}