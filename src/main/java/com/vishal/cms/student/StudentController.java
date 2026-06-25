package com.vishal.cms.student;

import com.vishal.cms.student.dto.StudentRequest;
import com.vishal.cms.student.dto.StudentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public List<StudentResponse> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/strength")
    public Long getStrengthStudents() {
        return studentService.countStudents();
    }

    @GetMapping("/department/{departmentId}/strength")
    public Long getDepartmentStrength(@PathVariable Long departmentId) {
        return studentService.countStudentsByDepartment(departmentId);
    }
    @GetMapping("/status/{status}/strength")
    public Long getStatusStrength(@PathVariable StudentStatus status) {
        return studentService.countStudentsByStatus(status);
    }

    @GetMapping("/{id}")
    public StudentResponse getStudentById(
            @PathVariable Long id
    ) {
        return studentService.getStudentById(id);
    }

    @GetMapping("/department/{departmentId}")
    public List<StudentResponse> getStudentsByDepartment(
            @PathVariable Long departmentId
    ){
        return studentService.getStudentsByDepartment(departmentId);
    }

    @GetMapping("/status/{status}")
    public List<StudentResponse> getStudentsByStatus(
            @PathVariable StudentStatus status
    ){
        return studentService.getStudentsByStatus(status);
    }

    @PostMapping
    public StudentResponse createStudent(
            @Valid @RequestBody StudentRequest request
    ) {
        return studentService.createStudent(request);
    }

    @PutMapping("/{id}")
    public StudentResponse updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request
    ) {
        return studentService.updateStudent(
                id,
                request
        );
    }
    @PatchMapping("/{id}/graduate")
    public StudentResponse updateStudentGraduate(@PathVariable Long id){
        return studentService.updateStudentGraduate(id);
    }

    @PatchMapping("/{id}/suspend")
    public StudentResponse updateStudentSuspend(@PathVariable Long id){
        return studentService.updateStudentSuspend(id);
    }

    @PatchMapping("/{id}/activate")
    public StudentResponse updateStudentActivate(@PathVariable Long id){
        return  studentService.updateStudentActivate(id);
    }

    @PatchMapping("/{id}/deactivate")
    public StudentResponse updateStudentDeactivate(@PathVariable Long id){
        return studentService.updateStudentDeactivate(id);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(
            @PathVariable Long id
    ) {
        studentService.deleteStudentById(id);
    }
}