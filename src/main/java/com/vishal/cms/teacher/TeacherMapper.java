package com.vishal.cms.teacher;

import com.vishal.cms.teacher.dto.TeacherResponse;

import java.util.stream.Collectors;

public class TeacherMapper {

    public static TeacherResponse toResponse(Teacher teacher) {

        return TeacherResponse.builder()
                .teacherId(teacher.getTeacherId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .qualification(teacher.getQualification())
                .specialization(teacher.getSpecialization())
                .joiningDate(teacher.getJoiningDate())
                .salary(teacher.getSalary())
                .active(teacher.isActive())

                .departmentId(
                        teacher.getDepartment() != null
                                ? teacher.getDepartment().getId()
                                : null
                )

                .departmentName(
                        teacher.getDepartment() != null
                                ? teacher.getDepartment().getName()
                                : null
                )

                .userId(
                        teacher.getUser() != null
                                ? teacher.getUser().getId()
                                : null
                )

                .subjectIds(
                        teacher.getSubjects()
                                .stream()
                                .map(subject -> subject.getId())
                                .collect(Collectors.toSet())
                )

                .courseIds(
                        teacher.getCourses()
                                .stream()
                                .map(course -> course.getId())
                                .collect(Collectors.toSet())
                )

                .build();
    }
}