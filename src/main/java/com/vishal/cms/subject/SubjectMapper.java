package com.vishal.cms.subject;

import com.vishal.cms.course.Course;
import com.vishal.cms.department.Department;
import com.vishal.cms.subject.dto.SubjectRequest;
import com.vishal.cms.subject.dto.SubjectResponse;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {

    public Subject toEntity(
            SubjectRequest request,
            Department department,
            Course course
    ) {

        return Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .credits(request.getCredits())
                .theoryHours(request.getTheoryHours())
                .practicalHours(request.getPracticalHours())
                .semester(request.getSemester())
                .active(
                        request.getActive() != null
                                ? request.getActive()
                                : true
                )
                .department(department)
                .course(course)
                .build();
    }

    public SubjectResponse toResponse(Subject subject) {

        return SubjectResponse.builder()
                .id(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .subjectName(subject.getSubjectName())
                .credits(subject.getCredits())
                .theoryHours(subject.getTheoryHours())
                .practicalHours(subject.getPracticalHours())
                .semester(subject.getSemester())
                .active(subject.getActive())

                .departmentId(
                        subject.getDepartment() != null
                                ? subject.getDepartment().getId()
                                : null
                )

                .departmentName(
                        subject.getDepartment() != null
                                ? subject.getDepartment().getName()
                                : null
                )

                .courseId(
                        subject.getCourse() != null
                                ? subject.getCourse().getId()
                                : null
                )

                .courseName(
                        subject.getCourse() != null
                                ? subject.getCourse().getCourseName()
                                : null
                )

                .build();
    }

    public void updateEntity(
            Subject subject,
            SubjectRequest request,
            Department department,
            Course course
    ) {

        subject.setSubjectCode(request.getSubjectCode());
        subject.setSubjectName(request.getSubjectName());
        subject.setCredits(request.getCredits());
        subject.setTheoryHours(request.getTheoryHours());
        subject.setPracticalHours(request.getPracticalHours());
        subject.setSemester(request.getSemester());
        subject.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : subject.getActive()
        );

        subject.setDepartment(department);
        subject.setCourse(course);
    }
}