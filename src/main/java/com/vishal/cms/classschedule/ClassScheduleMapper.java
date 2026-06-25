package com.vishal.cms.classschedule;

import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.classschedule.dto.ClassScheduleRequest;
import com.vishal.cms.classschedule.dto.ClassScheduleResponse;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.teacher.Teacher;
import org.springframework.stereotype.Component;

@Component
public class ClassScheduleMapper {
    public ClassSchedule toEntity(ClassScheduleRequest request, Teacher teacher, Subject subject, Classroom classroom) {
        return ClassSchedule.builder()
                .teacher(teacher)
                .subject(subject)
                .classroom(classroom)
                .dayOfWeek(
                        request.getDayOfWeek())
                .startTime(
                        request.getStartTime())
                .endTime(request.getEndTime())
                .semester(request.getSemester())
                .academicYear(request.getAcademicYear())
                .build();
    }

    public ClassScheduleResponse toResponse(ClassSchedule schedule) {
        return ClassScheduleResponse.
                builder()
                .scheduleId(schedule.getScheduleId())
                .teacherId(schedule.getTeacher()
                        .getTeacherId())
                .teacherName(schedule.getTeacher()
                        .getFirstName()
                        + " " +
                        schedule.getTeacher()
                                .getLastName())
                .subjectId(schedule.getSubject()
                        .getId())
                .subjectName(schedule.getSubject()
                        .getSubjectName())
                .classroomId(schedule
                        .getClassroom().getId())
                .classroomName(schedule.getClassroom()
                        .getRoomNumber())
                .dayOfWeek(schedule.getDayOfWeek())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .semester(schedule.getSemester())
                .academicYear(schedule.getAcademicYear())
                .build();
    }
}