package com.vishal.cms.attendance.dto;

import com.vishal.cms.attendance.AttendanceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AttendanceResponse {

    private Long attendanceId;

    private Long studentId;
    private String studentName;

    private Long subjectId;
    private String subjectName;

    private Long markedById;
    private String teacherName;

    private LocalDate attendanceDate;

    private AttendanceStatus status;
}