package com.vishal.cms.classschedule.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassScheduleRequest {

    @NotNull
    private Long teacherId;

    @NotNull
    private Long subjectId;

    @NotNull
    private Long classroomId;

    @NotNull
    private DayOfWeek dayOfWeek;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    private String semester;

    private String academicYear;
}