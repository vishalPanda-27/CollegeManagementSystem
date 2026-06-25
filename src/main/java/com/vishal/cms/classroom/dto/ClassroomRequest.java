package com.vishal.cms.classroom.dto;

import com.vishal.cms.classroom.RoomStatus;
import com.vishal.cms.classroom.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassroomRequest {

    @NotBlank
    private String roomNumber;

    @NotBlank
    private String buildingName;

    private Integer floor;

    @Min(30)
    private Integer capacity;

    @NotNull
    private RoomType roomType;

    @NotNull
    private RoomStatus status;

    private Long departmentId;
}