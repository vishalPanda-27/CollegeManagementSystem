package com.vishal.cms.teacher;

import com.vishal.cms.course.Course;
import com.vishal.cms.department.Department;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.teacher.dto.TeacherRequest;
import com.vishal.cms.teacher.dto.TeacherResponse;
import com.vishal.cms.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TeacherMapper {

    public Teacher toEntity(TeacherRequest request,Department department,User user,Set<Subject> subjects,Set<Course> courses) {
        Teacher teacher = new Teacher();

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setJoiningDate(
                request.getJoiningDate() == null
                        ? LocalDate.now()
                        : request.getJoiningDate()
        );
        teacher.setSalary(request.getSalary());
        teacher.setActive(request.isActive());

        if (request.getDepartmentId() != null) {

            teacher.setDepartment(department);
        }

        if (request.getUserId() != null) {
            teacher.setUser(user);
        }

        if (request.getSubjectIds() != null &&
                !request.getSubjectIds().isEmpty()) {
            if(subjects.size() != request.getSubjectIds().size()){
                throw new IllegalArgumentException(
                        "One or more subject ids are invalid"
                );
            }
            for (Subject subject : subjects) {
                if (!subject.getDepartment()
                        .getId()
                        .equals(request.getDepartmentId())) {

                    throw new IllegalStateException(
                            "Subject " + subject.getSubjectCode()
                                    + " does not belong to teacher department"
                    );
                }
            }
            teacher.setSubjects(subjects);
        }

        if (request.getCourseIds() != null &&
                !request.getCourseIds().isEmpty()) {
            if(courses.size() != request.getCourseIds().size()){
                throw new IllegalArgumentException(
                        "One or more course ids are invalid"
                );
            }
            for (Course course : courses) {
                if (!course.getDepartment()
                        .getId()
                        .equals(request.getDepartmentId())) {

                    throw new IllegalStateException(
                            "Course " + course.getCourseCode()
                                    + " does not belong to teacher department"
                    );
                }
            }

            teacher.setCourses(courses);
        }
        return  teacher;
    }

    public TeacherResponse toResponse(Teacher teacher) {

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