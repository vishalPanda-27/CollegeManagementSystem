package com.vishal.cms.timetable;

import com.vishal.cms.timetable.dto.TimetableRequest;
import com.vishal.cms.timetable.dto.TimetableResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/v1/timetables")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping
    public List<TimetableResponse> getAllTimetables() {
        return timetableService.getAllTimetables();
    }

    @GetMapping("/{id}")
    public TimetableResponse getTimetableById(
            @PathVariable Long id
    ) {
        return timetableService.getTimetableById(id);
    }
    @GetMapping("/course/{courseId}")
    public List<TimetableResponse> getTimetablesByCourseId(@PathVariable Long courseId) {
        return timetableService.getTimetablesCourseId(courseId);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<TimetableResponse> getTimetablesByTeacherId(@PathVariable Long teacherId) {
        return timetableService.getTimetablesByTeacherId(teacherId);
    }

    @GetMapping("/classroom/{classroomId}")
    public List<TimetableResponse> getTimetablesByClassroomId(@PathVariable Long classroomId) {
        return timetableService.getTimetablesByClassroomId(classroomId);
    }

    @GetMapping("/day/{dayOfWeek}")
    public List<TimetableResponse> getTimetablesByDayOfWeek(@PathVariable DayOfWeek dayOfWeek) {
        return timetableService.getTimetablesByDayOfWeek(dayOfWeek);
    }

    @GetMapping("/strength")
    public Long getTotalCount(){
        return timetableService.countAll();
    }

    @GetMapping("/teacher/{id}/strength")
    public Long getTeacherStrength(@PathVariable Long id){
        return timetableService.getTeacherStrength(id);
    }

    @GetMapping("/course/{id}/strength")
    public Long getCourseStrength(@PathVariable Long id){
        return timetableService.getCourseStrength(id);
    }

    @GetMapping("/classroom/{id}/strength")
    public Long getClassroomStrength(@PathVariable Long id){
        return timetableService.getClassroomStrength(id);
    }

    @PostMapping
    public TimetableResponse createTimetable(
            @Valid @RequestBody TimetableRequest request
    ) {
        return timetableService.createTimetable(request);
    }

    @PutMapping("/{id}")
    public TimetableResponse updateTimetable(
            @PathVariable Long id,
            @Valid @RequestBody TimetableRequest request
    ) {
        return timetableService.updateTimetable(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTimetable(
            @PathVariable Long id
    ) {
        timetableService.deleteTimetable(id);
    }
}