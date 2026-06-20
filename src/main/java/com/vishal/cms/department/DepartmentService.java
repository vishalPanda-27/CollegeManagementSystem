package com.vishal.cms.department;

import com.vishal.cms.department.dto.DepartmentRequest;
import com.vishal.cms.department.dto.DepartmentResponse;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.TeacherNotFoundException;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

        Department department =
                departmentMapper.toEntity(request);

        return departmentMapper.toResponse(
                departmentRepository.save(department));
    }

    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request) {

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

        department.setHod(teacher);

        return departmentMapper.toResponse(
                departmentRepository.save(department));
    }

    public void deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found"));

        departmentRepository.delete(department);
    }
}