package com.vishal.cms.teacher;

import com.vishal.cms.teacher.dto.TeacherRequest;
import com.vishal.cms.teacher.dto.TeacherResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teachers")
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

    @GetMapping("/department/{departmentId}")
    public List<TeacherResponse> getTeachersByDepartment(@PathVariable Long departmentId) {
        return teacherService.findByDepartmentId(departmentId);
    }

    @GetMapping("/active")
    public List<TeacherResponse> getActiveTeachers() {
        return teacherService.findByActive(true);
    }
    @GetMapping("/inactive")
    public List<TeacherResponse> getInactiveTeachers() {
        return teacherService.findByActive(false);
    }

    @GetMapping("/strength")
    public Long getStrengthTeachers() {
        return teacherService.countAll();
    }

    @GetMapping("/department/{departmentId}/strength")
    public Long getStrengthTeachersByDepartment(@PathVariable Long departmentId) {
        return teacherService.countByDepartmentId(departmentId);
    }

    @GetMapping("/active/strength")
    public Long getActiveStrengthTeachers() {
        return teacherService.countByActive(true);
    }

    @GetMapping("/inactive/strength")
    public Long getInactiveStrengthTeachers() {
        return teacherService.countByActive(false);
    }

    @PatchMapping("/{id}/activate")
    public TeacherResponse activateTeacher(@PathVariable Long id) {
        return teacherService.setTeacherStatus(id,true);
    }

    @PatchMapping("/{id}/deactivate")
    public TeacherResponse deactivateTeacher(@PathVariable Long id) {
        return teacherService.setTeacherStatus(id,false);
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
