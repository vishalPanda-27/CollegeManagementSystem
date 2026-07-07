package com.vishal.cms.classschedule;

import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.classroom.ClassroomRepository;
import com.vishal.cms.classschedule.dto.ClassScheduleRequest;
import com.vishal.cms.classschedule.dto.ClassScheduleResponse;
import com.vishal.cms.exceptions.ClassScheduleNotFoundException;
import com.vishal.cms.exceptions.ClassroomNotFoundException;
import com.vishal.cms.exceptions.SubjectNotFoundException;
import com.vishal.cms.exceptions.TeacherNotFoundException;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassScheduleService {
    private final ClassScheduleRepository scheduleRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ClassroomRepository classroomRepository;
    private final ClassScheduleMapper mapper;

    public List<ClassScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    public ClassScheduleResponse getScheduleById(Long id) {
        return mapper.toResponse(findSchedule(id));
    }

    public ClassScheduleResponse createSchedule(ClassScheduleRequest request) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalStateException("End time must be after start time");
        }

        Teacher teacher = teacherRepository.findById(
                request.getTeacherId()).orElseThrow(
                        () -> new TeacherNotFoundException("Teacher not found with id: " + request.getTeacherId()));

        Subject subject = subjectRepository.findById(
                request.getSubjectId()).orElseThrow(
                        () -> new SubjectNotFoundException("Subject not found with id: " + request.getSubjectId()));

        Classroom classroom = classroomRepository.findById(
                request.getClassroomId()).orElseThrow(
                        () -> new ClassroomNotFoundException("Classroom not found with id: " + request.getClassroomId()));

        ClassSchedule schedule = mapper.toEntity(request, teacher, subject, classroom);
        return mapper.toResponse(scheduleRepository.save(schedule));
    }

    public ClassScheduleResponse updateSchedule(Long id, ClassScheduleRequest request) {

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalStateException("End time must be after start time");
        }

        ClassSchedule existing = findSchedule(id);

        if (scheduleRepository.existsByTeacher_TeacherIdAndDayOfWeekAndStartTime(request.getTeacherId(), request.getDayOfWeek(), request.getStartTime())
                && !existing.getTeacher().getTeacherId().equals(request.getTeacherId())) {
            throw new IllegalStateException("Teacher already has a class at this time");
        }

        Teacher teacher = teacherRepository.findById(
                request.getTeacherId()).orElseThrow(
                        () -> new TeacherNotFoundException("Teacher not found with id: " + request.getTeacherId()));
        Subject subject = subjectRepository.findById(
                request.getSubjectId()).orElseThrow(
                        () -> new SubjectNotFoundException("Subject not found with id: " + request.getSubjectId()));

        Classroom classroom = classroomRepository.findById(
                request.getClassroomId()).orElseThrow(
                        () -> new ClassroomNotFoundException("Classroom not found with id: " + request.getClassroomId()));

        existing.setTeacher(teacher);
        existing.setSubject(subject);
        existing.setClassroom(classroom);
        existing.setDayOfWeek(request.getDayOfWeek());
        existing.setStartTime(request.getStartTime());
        existing.setEndTime(request.getEndTime());
        existing.setSemester(request.getSemester());
        existing.setAcademicYear(request.getAcademicYear());

        return mapper.toResponse(scheduleRepository.save(existing));
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.delete(findSchedule(id));
    }

    public List<ClassScheduleResponse> getSchedulesByTeacher(Long teacherId) {
        return scheduleRepository.findByTeacher_TeacherId(teacherId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    private ClassSchedule findSchedule(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(
                        () -> new ClassScheduleNotFoundException("Schedule not found with id: " + id));
    }

    public List<ClassScheduleResponse> getSchedulesByDay(DayOfWeek day) {
        return scheduleRepository.findByDayOfWeek(day)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ClassScheduleResponse> getSchedulesByClassroom(Long classroomId) {
        return scheduleRepository.findByClassroomId(classroomId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}