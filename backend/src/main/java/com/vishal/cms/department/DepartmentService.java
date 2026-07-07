package com.vishal.cms.department;

import com.vishal.cms.department.dto.DepartmentRequest;
import com.vishal.cms.department.dto.DepartmentResponse;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.TeacherNotFoundException;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentMapper departmentMapper;

    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    public DepartmentResponse getDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id: " + id));

        return departmentMapper.toResponse(department);
    }

    public DepartmentResponse createDepartment(
            DepartmentRequest request) {

        if (departmentRepository.existsByCode(request.getCode())) {
            throw new IllegalStateException(
                    "Department code already exists");
        }
        if(departmentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }


        Department department =
                departmentMapper.toEntity(request);

        return departmentMapper.toResponse(
                departmentRepository.save(department));
    }

    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request) {

        Department existing =
                departmentRepository.findByCode(
                        request.getCode()
                ).orElse(null);

        if (existing != null &&
                !existing.getId().equals(id)) {
            throw new IllegalStateException(
                    "Department code already exists"
            );
        }

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id: " + id));

        department.setCode(request.getCode());
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setEmail(request.getEmail());
        department.setPhoneNumber(request.getPhoneNumber());

        return departmentMapper.toResponse(
                departmentRepository.save(department));
    }

    public DepartmentResponse assignHod(
            Long departmentId,
            Long teacherId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found"));

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new TeacherNotFoundException(
                                "Teacher not found"));

        if (teacher.getDepartment() == null ||
                !teacher.getDepartment()
                        .getId()
                        .equals(departmentId)) {

            throw new IllegalStateException(
                    "Teacher does not belong to this department"
            );
        }

        department.setHod(teacher);

        return departmentMapper.toResponse(
                departmentRepository.save(department));
    }

    public void deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found"));

        if (!department.getStudents().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete department with students"
            );
        }
        if (!department.getTeachers().isEmpty()){
            throw new IllegalStateException("Cannot delete department with teachers");
        }
        if (!department.getCourses().isEmpty()){
            throw new IllegalStateException("Cannot delete department with courses");
        }
        if (!department.getPrograms().isEmpty()){
            throw new IllegalStateException("Cannot delete department with programs");
        }
        if (!department.getClassrooms().isEmpty()){
            throw new IllegalStateException("Cannot delete department with classrooms");
        }

        departmentRepository.delete(department);
    }
}