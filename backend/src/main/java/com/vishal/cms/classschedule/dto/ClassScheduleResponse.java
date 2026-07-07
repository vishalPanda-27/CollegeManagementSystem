package com.vishal.cms.classschedule.dto;

import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassScheduleResponse {

    private Long scheduleId;

    private Long teacherId;

    private String teacherName;

    private Long subjectId;

    private String subjectName;

    private Long classroomId;

    private String classroomName;

    private DayOfWeek dayOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;

    private String semester;

    private String academicYear;
}