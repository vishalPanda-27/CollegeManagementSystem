package com.vishal.cms.attendance.dto;

import com.vishal.cms.attendance.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long subjectId;

    private Long markedById;

    @NotNull
    private LocalDate attendanceDate;

    @NotNull
    private AttendanceStatus status;
}