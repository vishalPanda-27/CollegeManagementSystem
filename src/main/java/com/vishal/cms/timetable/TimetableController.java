package com.vishal.cms.timetable;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timetables")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping
    public List<Timetable> getAllTimetables() {
        return timetableService.getAllTimetables();
    }

    @GetMapping("/{id}")
    public Timetable getTimetableById(@PathVariable Long id) {
        return timetableService.getTimetableById(id);
    }

    @PostMapping
    public Timetable createTimetable(
            @RequestBody Timetable timetable) {
        return timetableService.createTimetable(timetable);
    }

    @PutMapping("/{id}")
    public Timetable updateTimetable(
            @PathVariable Long id,
            @RequestBody Timetable timetable) {
        return timetableService.updateTimetable(id, timetable);
    }

    @DeleteMapping("/{id}")
    public void deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
    }
}