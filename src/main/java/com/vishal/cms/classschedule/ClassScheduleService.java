package com.vishal.cms.classschedule;

import com.vishal.cms.exceptions.ClassScheduleNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassScheduleService {

    private final ClassScheduleRepository scheduleRepository;

    public List<ClassSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public ClassSchedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new ClassScheduleNotFoundException("Schedule not found"));
    }

    public ClassSchedule createSchedule(ClassSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public ClassSchedule updateSchedule(Long id,
                                        ClassSchedule updatedSchedule) {

        ClassSchedule existing = getScheduleById(id);

        existing.setTeacher(updatedSchedule.getTeacher());
        existing.setSubject(updatedSchedule.getSubject());
        existing.setClassroom(updatedSchedule.getClassroom());
        existing.setDayOfWeek(updatedSchedule.getDayOfWeek());
        existing.setStartTime(updatedSchedule.getStartTime());
        existing.setEndTime(updatedSchedule.getEndTime());
        existing.setSemester(updatedSchedule.getSemester());
        existing.setAcademicYear(updatedSchedule.getAcademicYear());

        return scheduleRepository.save(existing);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    public List<ClassSchedule> getSchedulesByTeacher(Long teacherId) {
        return scheduleRepository.findByTeacherTeacherId(teacherId);
    }
}