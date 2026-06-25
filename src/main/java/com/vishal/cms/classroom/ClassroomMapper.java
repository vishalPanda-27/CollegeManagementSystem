package com.vishal.cms.classroom;

import com.vishal.cms.classroom.dto.ClassroomRequest;
import com.vishal.cms.classroom.dto.ClassroomResponse;
import com.vishal.cms.department.Department;
import org.springframework.stereotype.Component;

@Component
public class ClassroomMapper {

    public Classroom toEntity(
            ClassroomRequest request,
            Department department
    ) {

        Classroom classroom = new Classroom();

        classroom.setRoomNumber(request.getRoomNumber());
        classroom.setBuildingName(request.getBuildingName());
        classroom.setFloor(request.getFloor());
        classroom.setCapacity(request.getCapacity());
        classroom.setRoomType(request.getRoomType());
        classroom.setStatus(request.getStatus());
        classroom.setDepartment(department);

        return classroom;
    }

    public ClassroomResponse toResponse(Classroom classroom) {

        return ClassroomResponse.builder()
                .id(classroom.getId())
                .roomNumber(classroom.getRoomNumber())
                .buildingName(classroom.getBuildingName())
                .floor(classroom.getFloor())
                .capacity(classroom.getCapacity())
                .roomType(classroom.getRoomType())
                .status(classroom.getStatus())
                .departmentId(
                        classroom.getDepartment() != null
                                ? classroom.getDepartment().getId()
                                : null
                )
                .departmentName(
                        classroom.getDepartment() != null
                                ? classroom.getDepartment().getName()
                                : null
                )
                .build();
    }
}