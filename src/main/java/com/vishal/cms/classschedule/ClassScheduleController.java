package com.vishal.cms.classschedule;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ClassScheduleController {

    private final ClassScheduleService scheduleService;

    @GetMapping
    public List<ClassSchedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public ClassSchedule getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }

    @PostMapping
    public ClassSchedule createSchedule(
            @RequestBody ClassSchedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    @PutMapping("/{id}")
    public ClassSchedule updateSchedule(
            @PathVariable Long id,
            @RequestBody ClassSchedule schedule) {
        return scheduleService.updateSchedule(id, schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<ClassSchedule> getTeacherSchedules(
            @PathVariable Long teacherId) {
        return scheduleService.getSchedulesByTeacher(teacherId);
    }
}