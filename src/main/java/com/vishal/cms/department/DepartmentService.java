package com.vishal.cms.department;

import com.vishal.cms.exceptions.DepartmentNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartment(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new DepartmentNotFoundException("Department not found with id: " + id));
    }

    public Department saveDepartment(Department department) {

        if(departmentRepository.existsByCode(department.getCode())){
            throw new IllegalStateException(
                    "Department code already exists");
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department department = getDepartment(id);

        department.setCode(updatedDepartment.getCode());
        department.setName(updatedDepartment.getName());
        department.setDescription(updatedDepartment.getDescription());
        department.setEmail(updatedDepartment.getEmail());
        department.setPhoneNumber(updatedDepartment.getPhoneNumber());

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
