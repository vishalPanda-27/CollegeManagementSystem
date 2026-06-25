package com.vishal.cms.timetable.dto;

import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableResponse {

    private Long timetableId;

    private DayOfWeek dayOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;

    private Long classroomId;
    private String classroomName;

    private Long courseId;
    private String courseName;

    private Long subjectId;
    private String subjectName;

    private Long teacherId;
    private String teacherName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}