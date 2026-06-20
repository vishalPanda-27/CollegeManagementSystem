package com.vishal.cms.teacher;

import com.vishal.cms.student.Student;
import com.vishal.cms.teacher.dto.TeacherRequest;
import com.vishal.cms.teacher.dto.TeacherResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teacher")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public List<TeacherResponse> getAllTeachers() {
        return teacherService.findAll();
    }

    @GetMapping("/{id}")
    public TeacherResponse getTeacher(@PathVariable Long id) {
        return teacherService.findByTeacherId(id);
    }

    @PutMapping("/{id}")
    public TeacherResponse updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request) {

        return teacherService.updateTeacher(id, request);
    }

    @PostMapping
    public TeacherResponse addTeacher(
            @Valid @RequestBody TeacherRequest request) {

        return teacherService.createTeacher(request);
    }

    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        teacherService.deleteById(id);
    }
}
