package com.vishal.cms.teacher;

import com.vishal.cms.student.Student;
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
    public List<Teacher> getAllTeachers() {
        return teacherService.findAll();
    }

    @GetMapping("/{id}")
    public Teacher getTeacher(@PathVariable Long id) {
        return teacherService.findByTeacherId(id);
    }

    @PutMapping("/{id}")
    public Teacher updateTeacher(
            @RequestBody Teacher teacher,
            @PathVariable Long id) {

        Teacher existing = teacherService.findByTeacherId(id);

        existing.setFirstName(teacher.getFirstName());
        existing.setLastName(teacher.getLastName());
        existing.setEmail(teacher.getEmail());
        existing.setPhone(teacher.getPhone());
        existing.setQualification(teacher.getQualification());
        existing.setSpecialization(teacher.getSpecialization());
        existing.setSalary(teacher.getSalary());

        return teacherService.saveTeacher(existing);
    }

    @PostMapping
    public Teacher addTeacher(
            @Valid @RequestBody Teacher teacher) {
        return teacherService.saveTeacher(teacher);
    }

    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        teacherService.deleteById(id);
    }
}
