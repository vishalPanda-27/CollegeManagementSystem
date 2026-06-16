package com.vishal.cms.classroom;

import com.vishal.cms.department.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    List<Classroom> findByStatus(RoomStatus status);

    List<Classroom> findByDepartment(Department department);

    List<Classroom> findByBuildingName(String buildingName);

    boolean existsByRoomNumber(String roomNumber);
}
