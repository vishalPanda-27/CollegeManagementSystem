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

    @GetMapping("/{id}")
    public StudentResponse getStudentById(
            @PathVariable Long id
    ) {
        return studentService.getStudentById(id);
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

    @DeleteMapping("/{id}")
    public void deleteStudent(
            @PathVariable Long id
    ) {
        studentService.deleteStudentById(id);
    }
}