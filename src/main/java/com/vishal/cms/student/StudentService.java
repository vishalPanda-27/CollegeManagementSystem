package com.vishal.cms.student;

import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.student.dto.StudentRequest;
import com.vishal.cms.student.dto.StudentResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentMapper studentMapper;
    
    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(studentMapper::toResponse)
                .toList();
    }

    public StudentResponse getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        return studentMapper.toResponse(student);
    }

    public StudentResponse createStudent(
            StudentRequest request
    ) {
        if (studentRepository.existsByEmail(
                request.email()
        )) {
            throw new IllegalStateException(
                    "Email already exists"
            );
        }
        if (studentRepository.existsByRollNumber(
                request.rollNumber()
        )) {
            throw new IllegalStateException(
                    "Roll number already exists"
            );
        }

        Department department = departmentRepository
                .findById(request.departmentId())
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found"
                        )
                );

        Student student =
                studentMapper.toEntity(
                        request,
                        department
                );

        Student savedStudent =
                studentRepository.save(student);

        return studentMapper.toResponse(
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
                        new DepartmentNotFoundException(
                                "Department not found"
                        )
                );
        Student existingEmail =
                studentRepository.findByEmail(request.email())
                        .orElse(null);

        if (
                existingEmail != null &&
                        !existingEmail.getId().equals(id)
        ) {
            throw new IllegalStateException(
                    "Email already exists"
            );
        }

        Student existingRoll = studentRepository.findByRollNumber(request.rollNumber()).orElse(null);

        if (existingRoll != null && !existingRoll.getId().equals(id)) {
            throw new IllegalStateException("Roll number already exists");
        }

        student.setRollNumber(request.rollNumber());
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setEmail(request.email());
        student.setPhoneNumber(request.phoneNumber());
        if (
                request.dateOfBirth() != null &&
                        request.dateOfBirth().isAfter(LocalDate.now())
        ) {
            throw new IllegalStateException(
                    "Invalid date of birth"
            );
        }
        student.setDateOfBirth(request.dateOfBirth());
        student.setGender(request.gender());
        student.setAddress(request.address());
        student.setAdmissionDate(request.admissionDate());
        student.setStatus(
                request.status() == null
                        ? student.getStatus()
                        : request.status()
        );
        student.setDepartment(department);

        Student updatedStudent =
                studentRepository.save(student);

        return studentMapper.toResponse(
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

        if (!student.getEnrollments().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete student with enrollments"
            );
        }

        if (!student.getAttendanceRecords().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete student with attendance records"
            );
        }

        if (!student.getResults().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete student with results"
            );
        }

        studentRepository.delete(student);
    }

    public List<StudentResponse> getStudentsByDepartment(Long departmentId) {
        departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found"
                        )
                );
        return studentRepository.findByDepartment_Id(departmentId)
                .stream()
                .map(studentMapper::toResponse)
                .toList();
    }

    public List<StudentResponse> getStudentsByStatus(StudentStatus status) {

        return studentRepository.findByStatus(status)
                .stream()
                .map(studentMapper::toResponse)
                .toList();
    }

    public StudentResponse updateStudentGraduate(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new StudentNotFoundException("Student not found with id: " + id)
                );
        if(student.getStatus() == StudentStatus.SUSPENDED){
            throw new IllegalStateException(
                    "Suspended student cannot graduate"
            );
        }
        student.setStatus(StudentStatus.GRADUATED);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    public StudentResponse updateStudentSuspend(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new StudentNotFoundException("Student not found with id: " + id)
                );
        if (
                student.getStatus()
                        == StudentStatus.GRADUATED
        ) {
            throw new IllegalStateException(
                    "Graduated student cannot be suspended"
            );
        }
        student.setStatus(StudentStatus.SUSPENDED);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    public StudentResponse updateStudentActivate(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new StudentNotFoundException("Student not found with id: " + id)
                );
        if (
                student.getStatus() ==
                        StudentStatus.GRADUATED
        ) {
            throw new IllegalStateException(
                    "Graduated student cannot be reactivated"
            );
        }
        student.setStatus(StudentStatus.ACTIVE);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    public StudentResponse updateStudentDeactivate(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new StudentNotFoundException("Student not found with id: " + id)
                );
        if(student.getStatus() == StudentStatus.GRADUATED){
            throw new IllegalStateException(
                    "Graduated student cannot be deactivated"
            );
        }
        student.setStatus(StudentStatus.INACTIVE);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    public long countStudents() {
        return studentRepository.count();
    }

    public long countStudentsByDepartment(Long departmentId) {
        departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found"
                        ));
        return studentRepository.countByDepartment_Id(departmentId);
    }

    public long countStudentsByStatus(StudentStatus status) {
        return studentRepository.countByStatus(status);
    }
}