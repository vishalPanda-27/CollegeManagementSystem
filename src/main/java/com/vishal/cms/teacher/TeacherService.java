package com.vishal.cms.teacher;

import com.vishal.cms.course.Course;
import com.vishal.cms.course.CourseRepository;
import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.TeacherNotFoundException;
import com.vishal.cms.subject.SubjectRepository;
import com.vishal.cms.teacher.dto.TeacherRequest;
import com.vishal.cms.teacher.dto.TeacherResponse;
import com.vishal.cms.user.User;
import com.vishal.cms.user.UserRepository;
import com.vishal.cms.subject.Subject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;

    public List<TeacherResponse> findAll() {
        return teacherRepository.findAll()
                .stream()
                .map(TeacherMapper::toResponse)
                .toList();
    }
    public TeacherResponse findByTeacherId(Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new TeacherNotFoundException(
                                "Teacher not found with id: " + teacherId));

        return TeacherMapper.toResponse(teacher);
    }

    public TeacherResponse createTeacher(TeacherRequest request) {

        Teacher teacher = new Teacher();

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setJoiningDate(request.getJoiningDate());
        teacher.setSalary(request.getSalary());
        teacher.setActive(request.isActive());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(
                    request.getDepartmentId()
            ).orElseThrow(() ->
                    new RuntimeException(
                            "Department not found: " +
                                    request.getDepartmentId()
                    ));

            teacher.setDepartment(department);
        }

        if (request.getUserId() != null) {
            User user = userRepository.findById(
                    request.getUserId()
            ).orElseThrow(() ->
                    new RuntimeException(
                            "User not found: " +
                                    request.getUserId()
                    ));

            teacher.setUser(user);
        }

        if (request.getSubjectIds() != null &&
                !request.getSubjectIds().isEmpty()) {

            Set<Subject> subjects =
                    new HashSet<>(
                            subjectRepository.findAllById(
                                    request.getSubjectIds()
                            )
                    );

            teacher.setSubjects(subjects);
        }

        if (request.getCourseIds() != null &&
                !request.getCourseIds().isEmpty()) {

            Set<Course> courses =
                    new HashSet<>(
                            courseRepository.findAllById(
                                    request.getCourseIds()
                            )
                    );

            teacher.setCourses(courses);
        }

        Teacher savedTeacher =
                teacherRepository.save(teacher);

        return TeacherMapper.toResponse(savedTeacher);
    }
    public TeacherResponse updateTeacher(
            Long teacherId,
            TeacherRequest request
    ) {

        Teacher teacher = getTeacherById(teacherId);

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setJoiningDate(request.getJoiningDate());
        teacher.setSalary(request.getSalary());
        teacher.setActive(request.isActive());

        if (request.getDepartmentId() != null) {

            Department department =
                    departmentRepository.findById(
                            request.getDepartmentId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Department not found: "
                                            + request.getDepartmentId()
                            ));

            teacher.setDepartment(department);
        }

        if (request.getUserId() != null) {

            User user =
                    userRepository.findById(
                            request.getUserId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "User not found: "
                                            + request.getUserId()
                            ));

            teacher.setUser(user);
        }

        if (request.getSubjectIds() != null) {

            Set<Subject> subjects =
                    new HashSet<>(
                            subjectRepository.findAllById(
                                    request.getSubjectIds()
                            )
                    );

            teacher.setSubjects(subjects);
        }

        if (request.getCourseIds() != null) {

            Set<Course> courses =
                    new HashSet<>(
                            courseRepository.findAllById(
                                    request.getCourseIds()
                            )
                    );

            teacher.setCourses(courses);
        }

        Teacher updatedTeacher =
                teacherRepository.save(teacher);

        return TeacherMapper.toResponse(updatedTeacher);
    }
    public Teacher getTeacherById(Long teacherId) {
        return teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new TeacherNotFoundException(
                                "Teacher not found with id: " +
                                        teacherId
                        ));
    }
    public void deleteById(Long teacherId) {
        teacherRepository.deleteById(teacherId);
    }
}
