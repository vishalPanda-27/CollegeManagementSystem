package com.vishal.cms.classschedule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {
    List<ClassSchedule> findByTeacher_TeacherId(Long teacherId);

    List<ClassSchedule> findByDayOfWeek(DayOfWeek dayOfWeek);

    List<ClassSchedule> findByClassroomId(Long classroomId);

    boolean existsByTeacher_TeacherIdAndDayOfWeekAndStartTime(Long teacherId, DayOfWeek dayOfWeek, LocalTime startTime);

    boolean existsByClassroom_IdAndDayOfWeekAndStartTime(Long classroomId, DayOfWeek dayOfWeek, LocalTime startTime);
}