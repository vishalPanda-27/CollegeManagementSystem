package com.vishal.cms.classroom;

import com.vishal.cms.classroom.dto.ClassroomRequest;
import com.vishal.cms.classroom.dto.ClassroomResponse;
import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.vishal.cms.exceptions.ClassroomNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final DepartmentRepository departmentRepository;

    private final ClassroomMapper classroomMapper;

    public ClassroomResponse createClassroom(
            ClassroomRequest request
    ) {

        if (classroomRepository.existsByRoomNumber(
                request.getRoomNumber())) {

            throw new IllegalStateException(
                    "Room number already exists");
        }

        Department department = null;

        if (request.getDepartmentId() != null) {

            department = departmentRepository
                    .findById(request.getDepartmentId())
                    .orElseThrow(() ->
                            new DepartmentNotFoundException(
                                    "Department not found with id: "
                                            + request.getDepartmentId()));
        }

        Classroom classroom =
                classroomMapper.toEntity(request, department);

        return classroomMapper.toResponse(
                classroomRepository.save(classroom)
        );
    }

    public ClassroomResponse getClassroomById(Long id) {

        return classroomMapper.toResponse(
                classroomRepository.findById(id)
                        .orElseThrow(() ->
                                new ClassroomNotFoundException(
                                        "Classroom not found with id: " + id
                                ))
        );
    }

    public List<ClassroomResponse> getAllClassrooms() {

        return classroomRepository.findAll()
                .stream()
                .map(classroomMapper::toResponse)
                .toList();
    }

    public ClassroomResponse updateClassroom(
            Long id,
            ClassroomRequest request
    ) {

        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() ->
                        new ClassroomNotFoundException(
                                "Classroom not found with id: " + id
                        ));

        Department department = null;

        if (request.getDepartmentId() != null) {

            department = departmentRepository
                    .findById(request.getDepartmentId())
                    .orElseThrow(() ->
                            new DepartmentNotFoundException(
                                    "Department not found with id: "
                                            + request.getDepartmentId()));
        }

        classroom.setRoomNumber(request.getRoomNumber());
        classroom.setBuildingName(request.getBuildingName());
        classroom.setFloor(request.getFloor());
        classroom.setCapacity(request.getCapacity());
        classroom.setRoomType(request.getRoomType());
        classroom.setStatus(request.getStatus());
        classroom.setDepartment(department);

        return classroomMapper.toResponse(
                classroomRepository.save(classroom)
        );
    }

    public void deleteClassroom(Long id) {

        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() ->
                        new ClassroomNotFoundException(
                                "Classroom not found with id: " + id
                        ));

        classroomRepository.delete(classroom);
    }

    public List<ClassroomResponse> getAvailableClassrooms() {
        return classroomRepository.findByStatus(RoomStatus.AVAILABLE)
                .stream()
                .map(classroomMapper ::toResponse)
                .toList();
    }

    public List<ClassroomResponse> getClassroomsByDepartment(long departmentId) {
        Department department = departmentRepository.findById(departmentId).orElseThrow(
                ()-> new DepartmentNotFoundException("Department not found with id: " + departmentId)
        );
        return classroomRepository.findByDepartment(department)
                .stream()
                .map(classroomMapper ::toResponse)
                .toList();
    }

    public List<ClassroomResponse> getClassroomsByBuilding(String buildingName) {
        return classroomRepository.findByBuildingName(buildingName)
                .stream()
                .map(classroomMapper ::toResponse)
                .toList();
    }

    public ClassroomResponse changeStatus(Long id, RoomStatus newStatus) {

        Classroom classroom = classroomRepository.findById(id).orElseThrow(
                () -> new ClassroomNotFoundException("Classroom not found with id: " + id)
        );

        classroom.setStatus(newStatus);


        return classroomMapper.toResponse(classroomRepository.save(classroom));
    }
}

