package com.vishal.cms.attendance;

import com.vishal.cms.attendance.dto.AttendanceResponse;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(Attendance attendance) {

        return AttendanceResponse.builder()
                .attendanceId(attendance.getAttendanceId())

                .studentId(attendance.getStudent().getId())
                .studentName(
                        attendance.getStudent().getFirstName()
                                + " "
                                + attendance.getStudent().getLastName()
                )

                .subjectId(attendance.getSubject().getId())
                .subjectName(attendance.getSubject().getSubjectName())

                .markedById(
                        attendance.getMarkedBy() != null
                                ? attendance.getMarkedBy().getTeacherId()
                                : null
                )
                .teacherName(
                        attendance.getMarkedBy() != null
                                ? attendance.getMarkedBy().getFirstName()
                                  + " "
                                  + attendance.getMarkedBy().getLastName()
                                : null
                )

                .attendanceDate(attendance.getAttendanceDate())
                .status(attendance.getStatus())
                .build();
    }
}