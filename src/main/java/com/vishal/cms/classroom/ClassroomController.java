package com.vishal.cms.classroom;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RestController;

import com.vishal.cms.department.Department;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;


    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @PostMapping
    public Classroom createClassroom(
            @Valid @RequestBody Classroom classroom
    ) {
        return classroomService.createClassroom(classroom);
    }

    @GetMapping("/{id}")
    public Classroom getClassroomById(
            @PathVariable Long id
    ) {
        return classroomService.getClassroomById(id);
    }

    @GetMapping
    public List<Classroom> getAllClassrooms() {
        return classroomService.getAllClassrooms();
    }

    @PutMapping("/{id}")
    public Classroom updateClassroom(
            @PathVariable Long id,
            @Valid
            @RequestBody Classroom classroom
    ) {
        return classroomService.updateClassroom(id, classroom);
    }

    @DeleteMapping("/{id}")
    public void deleteClassroom(
            @PathVariable Long id
    ) {
        classroomService.deleteClassroom(id);
    }

    @GetMapping("/available")
    public List<Classroom> getAvailableClassrooms() {
        return classroomService.getAvailableClassrooms();
    }

    @GetMapping("/building/{buildingName}")
    public List<Classroom> getClassroomsByBuilding(
            @PathVariable String buildingName
    ) {
        return classroomService.getClassroomsByBuilding(buildingName);
    }

    @GetMapping("/departments/{departmentId}/classrooms")
    public List<Classroom> getClassroomsByDepartment(
            @PathVariable Long departmentId
    ) {
        return classroomService.getClassroomsByDepartment(departmentId);
    }

    @PatchMapping("/{id}/status")
    public Classroom changeStatus(
            @PathVariable Long id,
            @RequestParam RoomStatus status
    ) {
        return classroomService.changeStatus(id, status);
    }
}
