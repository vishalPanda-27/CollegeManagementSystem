package com.vishal.cms.classschedule;

import com.vishal.cms.classschedule.dto.ClassScheduleRequest;
import com.vishal.cms.classschedule.dto.ClassScheduleResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ClassScheduleController {
    private final ClassScheduleService scheduleService;

    @GetMapping
    public List<ClassScheduleResponse> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public ClassScheduleResponse getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }

    @GetMapping("/day/{day}")
    public List<ClassScheduleResponse> getScheduleByDay(@PathVariable DayOfWeek day) {
        return scheduleService.getSchedulesByDay(day);
    }

    @GetMapping("/classroom/{classroomId}")
    public List<ClassScheduleResponse> getScheduleByClassroomId(@PathVariable Long classroomId) {
        return scheduleService.getSchedulesByClassroom(classroomId);
    }

    @PostMapping
    public ClassScheduleResponse createSchedule(@Valid @RequestBody ClassScheduleRequest request) {
        return scheduleService.createSchedule(request);
    }

    @PutMapping("/{id}")
    public ClassScheduleResponse updateSchedule(@PathVariable Long id, @Valid @RequestBody ClassScheduleRequest request) {
        return scheduleService.updateSchedule(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<ClassScheduleResponse> getTeacherSchedules(@PathVariable Long teacherId) {
        return scheduleService.getSchedulesByTeacher(teacherId);
    }
}