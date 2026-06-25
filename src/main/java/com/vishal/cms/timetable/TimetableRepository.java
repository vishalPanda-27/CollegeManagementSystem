package com.vishal.cms.timetable;

import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.course.Course;
import com.vishal.cms.teacher.Teacher;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface TimetableRepository
        extends JpaRepository<Timetable, Long> {
    boolean existsByClassroomAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThanAndTimetableIdNot(
            Classroom classroom,
            DayOfWeek dayOfWeek,
            LocalTime endTime,
            LocalTime startTime,
            Long timetableId
    );

    boolean existsByCourseAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThanAndTimetableIdNot(
            Course course,
            DayOfWeek dayOfWeek,
            LocalTime endTime,
            LocalTime startTime,
            Long timetableId
    );

    boolean existsByTeacherAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThanAndTimetableIdNot(
            Teacher teacher,
            DayOfWeek dayOfWeek,
            LocalTime endTime,
            LocalTime startTime,
            Long timetableId
    );

    List<Timetable> findByTeacher_TeacherId(Long teacherId);

    List<Timetable> findByClassroom_Id(Long classroomId);

    List<Timetable> findByDayOfWeek(DayOfWeek dayOfWeek);

    List<Timetable> findByCourse_Id(Long courseId);

    Long countByTeacher_TeacherId(Long id);

    Long countByCourse_Id(Long id);

    Long countByClassroom_Id(Long id);

    boolean existsByCourseAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(Course course, @NotNull DayOfWeek dayOfWeek, @NotNull LocalTime endTime, @NotNull LocalTime startTime);

    boolean existsByTeacherAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(Teacher teacher, @NotNull DayOfWeek dayOfWeek, @NotNull LocalTime endTime, @NotNull LocalTime startTime);

    boolean existsByClassroomAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(Classroom classroom, @NotNull DayOfWeek dayOfWeek, @NotNull LocalTime endTime, @NotNull LocalTime startTime);
}