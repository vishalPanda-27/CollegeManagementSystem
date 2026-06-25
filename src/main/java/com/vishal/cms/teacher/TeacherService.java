package com.vishal.cms.teacher;

import com.vishal.cms.course.Course;
import com.vishal.cms.course.CourseRepository;
import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.TeacherNotFoundException;
import com.vishal.cms.exceptions.UserNotFoundException;
import com.vishal.cms.subject.SubjectRepository;
import com.vishal.cms.teacher.dto.TeacherRequest;
import com.vishal.cms.teacher.dto.TeacherResponse;
import com.vishal.cms.user.User;
import com.vishal.cms.user.UserRepository;
import com.vishal.cms.subject.Subject;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherMapper teacherMapper;

    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;

    public List<TeacherResponse> findAll() {
        return teacherRepository.findAll()
                .stream()
                .map(teacherMapper::toResponse)
                .toList();
    }
    public TeacherResponse findByTeacherId(Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new TeacherNotFoundException(
                                "Teacher not found with id: " + teacherId));

        return teacherMapper.toResponse(teacher);
    }

    public List<TeacherResponse> findByDepartmentId(Long departmentId) {
        departmentRepository.findById(departmentId).orElseThrow(
                ()-> new DepartmentNotFoundException("Department not found with id: " + departmentId)
        );
        return teacherRepository.findByDepartment_Id(departmentId)
                .stream()
                .map(teacherMapper::toResponse)
                .toList();
    }

    public TeacherResponse createTeacher(TeacherRequest request) {

        if(teacherRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email already exists");
        }
        Department department = departmentRepository.findById(
                request.getDepartmentId()
        ).orElseThrow(() ->
                new DepartmentNotFoundException(
                        "Department not found: " +
                                request.getDepartmentId()
                ));

        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(
                    request.getUserId()
            ).orElseThrow(() ->
                    new UserNotFoundException(
                            "User not found: " +
                                    request.getUserId()
                    ));
        }

        Set<Subject> subjects =
                new HashSet<>(
                        subjectRepository.findAllById(
                                request.getSubjectIds() != null ? request.getSubjectIds() : Set.of()
                        )
                );

        Set<Course> courses =
                new HashSet<>(
                        courseRepository.findAllById(
                                request.getCourseIds() != null ? request.getCourseIds() : Set.of()
                        )
                );

        Teacher teacher = teacherMapper.toEntity(request, department, user, subjects, courses);
        return teacherMapper.toResponse(teacherRepository.save(teacher));
    }
    public TeacherResponse updateTeacher(
            Long teacherId,
            TeacherRequest request
    ) {
        Teacher existing = teacherRepository.findByEmail(request.getEmail()).orElse(null);

        if(existing != null &&
        !existing.getTeacherId().equals(teacherId)) {
            throw new IllegalArgumentException("Teacher already exists");
        }

        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(
                ()-> new TeacherNotFoundException("Teacher not found with id: " + teacherId)
        );

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setJoiningDate(
                request.getJoiningDate() == null
                        ? teacher.getJoiningDate()
                        : request.getJoiningDate()
        );
        teacher.setSalary(request.getSalary());
        teacher.setActive(request.isActive());

        if (request.getDepartmentId() != null) {

            Department department =
                    departmentRepository.findById(
                            request.getDepartmentId()
                    ).orElseThrow(() ->
                            new DepartmentNotFoundException(
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
                            new UserNotFoundException(
                                    "User not found: "
                                            + request.getUserId()
                            ));

            teacher.setUser(user);
        }

        if (request.getSubjectIds() != null) {
            Set<Subject> subjects = new HashSet<>(
                    subjectRepository.findAllById(request.getSubjectIds())
            );
            if (subjects.size() != request.getSubjectIds().size()) {
                throw new IllegalArgumentException("One or more subject ids are invalid");
            }
            for (Subject subject : subjects) {
                if (!subject.getDepartment().getId().equals(request.getDepartmentId())) {
                    throw new IllegalStateException(
                            "Subject " + subject.getSubjectCode() + " does not belong to teacher department"
                    );
                }
            }
            teacher.setSubjects(subjects);
        }

        if (request.getCourseIds() != null) {
            Set<Course> courses = new HashSet<>(
                    courseRepository.findAllById(request.getCourseIds())
            );
            if (courses.size() != request.getCourseIds().size()) {
                throw new IllegalArgumentException("One or more course ids are invalid");
            }
            for (Course course : courses) {
                if (!course.getDepartment().getId().equals(request.getDepartmentId())) {
                    throw new IllegalStateException(
                            "Course " + course.getCourseCode() + " does not belong to teacher department"
                    );
                }
            }
            teacher.setCourses(courses);
        }

        Teacher updatedTeacher =
                teacherRepository.save(teacher);

        return teacherMapper.toResponse(updatedTeacher);
    }
    public TeacherResponse getTeacherById(Long teacherId) {
        return teacherMapper.toResponse(teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new TeacherNotFoundException(
                                "Teacher not found with id: " +
                                        teacherId
                        )));
    }
    public void deleteById(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(
                () -> new TeacherNotFoundException("Teacher not found with id: " + teacherId));

        if (teacher.getAttendanceRecords() != null && !teacher.getAttendanceRecords().isEmpty()) {
            throw new IllegalStateException("Teacher with attendance records cannot be deleted");
        }
        if (teacher.getTimetables() != null && !teacher.getTimetables().isEmpty()) {
            throw new IllegalStateException("Teacher with timetables cannot be deleted");
        }
        if (teacher.getSchedules() != null && !teacher.getSchedules().isEmpty()) {
            throw new IllegalStateException("Teacher with class schedules cannot be deleted");
        }
        teacher.getSubjects().clear();
        teacher.getCourses().clear();
        teacherRepository.delete(teacher);
    }

    public List<TeacherResponse> findByActive(boolean active) {
        return teacherRepository.findByActive(active)
                .stream()
                .map(teacherMapper::toResponse)
                .toList();
    }
    public long countAll() {
        return teacherRepository.count();
    }

    public long countByDepartmentId(Long departmentId) {
        departmentRepository.findById(departmentId).orElseThrow(
                ()-> new DepartmentNotFoundException("Department not found: " + departmentId)
        );
        return teacherRepository.countByDepartment_Id(departmentId);
    }

    public Long countByActive(boolean status) {
        return teacherRepository.countByActive(status);
    }

    public TeacherResponse setTeacherStatus(Long id, boolean active) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(
                ()-> new TeacherNotFoundException("Teacher not found: " + id)
        );
        teacher.setActive(active);
        return teacherMapper.toResponse(teacherRepository.save(teacher));
    }

//    private void validateSubjects(Set<Subject> subjects) {
//
//    }
//    private void validateCourses(Set<Course> courses) {
//
//    }
}
