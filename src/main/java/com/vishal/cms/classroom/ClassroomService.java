package com.vishal.cms.classroom;

import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.vishal.cms.exceptions.ClassroomNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final DepartmentRepository departmentRepository;

    public Classroom createClassroom(Classroom classroom) {

        if (classroomRepository.existsByRoomNumber(
                classroom.getRoomNumber())) {

            throw new IllegalStateException(
                    "Room number already exists");
        }

        return classroomRepository.save(classroom);
    }

    public Classroom getClassroomById(Long id) {
        return classroomRepository.findById(id)
                .orElseThrow(() ->
                        new ClassroomNotFoundException(
                                "Classroom not found with id: " + id
                        ));
    }

    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    public Classroom updateClassroom(Long id, Classroom updatedClassroom) {

        Classroom classroom = getClassroomById(id);

        classroom.setRoomNumber(updatedClassroom.getRoomNumber());
        classroom.setBuildingName(updatedClassroom.getBuildingName());
        classroom.setFloor(updatedClassroom.getFloor());
        classroom.setCapacity(updatedClassroom.getCapacity());
        classroom.setRoomType(updatedClassroom.getRoomType());
        classroom.setStatus(updatedClassroom.getStatus());
        classroom.setDepartment(updatedClassroom.getDepartment());

        return classroomRepository.save(classroom);
    }

    public void deleteClassroom(Long id) {
        Classroom classroom = getClassroomById(id);
        classroomRepository.delete(classroom);
    }

    public List<Classroom> getAvailableClassrooms() {
        return classroomRepository.findByStatus(RoomStatus.AVAILABLE);
    }

    public List<Classroom> getClassroomsByDepartment(long departmentId) {
        Department department = departmentRepository.findById(departmentId).orElseThrow(
                ()-> new DepartmentNotFoundException("Department not found with id: " + departmentId)
        );
        return classroomRepository.findByDepartment(department);
    }

    public List<Classroom> getClassroomsByBuilding(String buildingName) {
        return classroomRepository.findByBuildingName(buildingName);
    }

    public Classroom changeStatus(Long id, RoomStatus newStatus) {

        Classroom classroom = getClassroomById(id);

        classroom.setStatus(newStatus);

        return classroomRepository.save(classroom);
    }
}

