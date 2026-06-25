package com.vishal.cms.classroom;

import com.vishal.cms.classroom.dto.ClassroomRequest;
import com.vishal.cms.classroom.dto.ClassroomResponse;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RestController;
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
    public ClassroomResponse createClassroom(
            @Valid @RequestBody ClassroomRequest request
    ) {
        return classroomService.createClassroom(request);
    }
    @GetMapping("/{id}")
    public ClassroomResponse getClassroomById(
            @PathVariable Long id
    ) {
        return classroomService.getClassroomById(id);
    }
    @GetMapping
    public List<ClassroomResponse> getAllClassrooms() {
        return classroomService.getAllClassrooms();
    }
    @PutMapping("/{id}")
    public ClassroomResponse updateClassroom(
            @PathVariable Long id,
            @Valid @RequestBody ClassroomRequest request
    ) {
        return classroomService.updateClassroom(id, request);
    }
    @DeleteMapping("/{id}")
    public void deleteClassroom(
            @PathVariable Long id
    ) {
        classroomService.deleteClassroom(id);
    }

    @GetMapping("/available")
    public List<ClassroomResponse> getAvailableClassrooms() {
        return classroomService.getAvailableClassrooms();

    }

    @GetMapping("/building/{buildingName}")
    public List<ClassroomResponse> getClassroomsByBuilding(
            @PathVariable String buildingName
    ) {
        return classroomService.getClassroomsByBuilding(buildingName);
    }

    @GetMapping("/department/{departmentId}")
    public List<ClassroomResponse> getClassroomsByDepartment(
            @PathVariable Long departmentId
    ) {
        return classroomService.getClassroomsByDepartment(departmentId);

    }

    @PatchMapping("/{id}/status")
    public ClassroomResponse changeStatus(
            @PathVariable Long id,
            @RequestParam RoomStatus status
    ) {
        return classroomService.changeStatus(id,status);
    }
}
