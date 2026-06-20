package com.vishal.cms.student;

import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.student.dto.StudentRequest;
import com.vishal.cms.student.dto.StudentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(StudentMapper::toResponse)
                .toList();
    }

    public StudentResponse getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        return StudentMapper.toResponse(student);
    }

    public StudentResponse createStudent(
            StudentRequest request
    ) {

        if (studentRepository.existsByEmail(
                request.email()
        )) {
            throw new RuntimeException(
                    "Email already exists"
            );
        }

        if (studentRepository.existsByRollNumber(
                request.rollNumber()
        )) {
            throw new RuntimeException(
                    "Roll number already exists"
            );
        }

        Department department = departmentRepository
                .findById(request.departmentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );

        Student student =
                StudentMapper.toEntity(
                        request,
                        department
                );

        Student savedStudent =
                studentRepository.save(student);

        return StudentMapper.toResponse(
                savedStudent
        );
    }

    public StudentResponse updateStudent(
            Long id,
            StudentRequest request
    ) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + id
                        )
                );

        Department department =
                departmentRepository.findById(
                        request.departmentId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );

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

        Student updatedStudent =
                studentRepository.save(student);

        return StudentMapper.toResponse(
                updatedStudent
        );
    }

    public void deleteStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + id
                        )
                );

        studentRepository.delete(student);
    }
}