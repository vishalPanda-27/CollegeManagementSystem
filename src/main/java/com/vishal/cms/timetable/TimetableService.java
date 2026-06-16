package com.vishal.cms.timetable;

import com.vishal.cms.exceptions.TimetableNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableService {

    private final TimetableRepository timetableRepository;

    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    public Timetable getTimetableById(Long id) {
        return timetableRepository.findById(id)
                .orElseThrow(() ->
                        new TimetableNotFoundException("Timetable not found with id: " + id)
                );
    }

    public Timetable createTimetable(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    public Timetable updateTimetable(Long id,
                                     Timetable updatedTimetable) {

        Timetable timetable = getTimetableById(id);

        timetable.setDayOfWeek(updatedTimetable.getDayOfWeek());
        timetable.setStartTime(updatedTimetable.getStartTime());
        timetable.setEndTime(updatedTimetable.getEndTime());
        timetable.setClassroom(updatedTimetable.getClassroom());
        timetable.setCourse(updatedTimetable.getCourse());
        timetable.setSubject(updatedTimetable.getSubject());
        timetable.setTeacher(updatedTimetable.getTeacher());

        return timetableRepository.save(timetable);
    }

    public void deleteTimetable(Long id) {
        timetableRepository.deleteById(id);
    }
}