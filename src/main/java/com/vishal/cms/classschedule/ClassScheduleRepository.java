package com.vishal.cms.classschedule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassScheduleRepository
        extends JpaRepository<ClassSchedule, Long> {

    List<ClassSchedule> findByTeacherTeacherId(Long teacherId);

    List<ClassSchedule> findByDayOfWeek(String dayOfWeek);
}