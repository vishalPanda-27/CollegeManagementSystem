package com.vishal.cms.classroom.dto;

import com.vishal.cms.classroom.RoomStatus;
import com.vishal.cms.classroom.RoomType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassroomResponse {

    private Long id;

    private String roomNumber;

    private String buildingName;

    private Integer floor;

    private Integer capacity;

    private RoomType roomType;

    private RoomStatus status;

    private Long departmentId;

    private String departmentName;
}