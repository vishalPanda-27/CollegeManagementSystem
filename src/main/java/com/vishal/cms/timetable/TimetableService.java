package com.vishal.cms.timetable;

import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.classroom.ClassroomRepository;
import com.vishal.cms.course.Course;
import com.vishal.cms.course.CourseRepository;
import com.vishal.cms.exceptions.*;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.teacher.TeacherRepository;
import com.vishal.cms.timetable.dto.TimetableRequest;
import com.vishal.cms.timetable.dto.TimetableResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final ClassroomRepository classroomRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final TimetableMapper timetableMapper;

    public List<TimetableResponse> getAllTimetables() {

        return timetableRepository.findAll()
                .stream()
                .map(timetableMapper::toResponse)
                .toList();
    }

    public TimetableResponse getTimetableById(Long id) {

        return timetableMapper.toResponse(
                timetableRepository.findById(id)
                        .orElseThrow(() ->
                                new TimetableNotFoundException(
                                        "Timetable not found with id: " + id
                                )
                        )
        );
    }

    public List<TimetableResponse> getTimetablesByTeacherId(Long teacherId) {
        teacherRepository.findById(teacherId).orElseThrow(() ->new TeacherNotFoundException("Teacher not found with id: " + teacherId));
        List<Timetable> teacherTimetable = timetableRepository.findByTeacher_TeacherId(teacherId);
        return teacherTimetable.stream().map(timetableMapper::toResponse).toList();
    }

    public List<TimetableResponse> getTimetablesByClassroomId(Long classroomId) {
        classroomRepository.findById(classroomId).orElseThrow(() ->new ClassroomNotFoundException("Classroom not found with id: " + classroomId));
        List<Timetable>  classroomTimetable = timetableRepository.findByClassroom_Id(classroomId);
        return classroomTimetable.stream().map(timetableMapper::toResponse).toList();
    }
    public List<TimetableResponse> getTimetablesByDayOfWeek(DayOfWeek dayOfWeek) {
        List<Timetable> dayTimetable = timetableRepository.findByDayOfWeek(dayOfWeek);
        return dayTimetable.stream().map(timetableMapper::toResponse).toList();
    }
    public List<TimetableResponse> getTimetablesCourseId(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course not found with id: " + courseId
                        ));
        List<Timetable> courseTimetable = timetableRepository.findByCourse_Id(courseId);
        return courseTimetable.stream().map(timetableMapper::toResponse).toList();
    }

    public TimetableResponse createTimetable(
            TimetableRequest request
    ) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalStateException("End time must be after start time");
        }

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(
                        "Classroom not found with id: " + request.getClassroomId()));

        if (timetableRepository.existsByClassroomAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(
                classroom, request.getDayOfWeek(), request.getEndTime(), request.getStartTime())) {
            throw new IllegalStateException("Classroom already occupied");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new CourseNotFoundException(
                        "Course not found with id: " + request.getCourseId()));

        if (timetableRepository.existsByCourseAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(
                course, request.getDayOfWeek(), request.getEndTime(), request.getStartTime())) {
            throw new IllegalStateException("Course already occupied");
        }

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException(
                        "Subject not found with id: " + request.getSubjectId()));

        if (!subject.getCourse().getId().equals(course.getId())) {
            throw new IllegalStateException("Subject does not belong to selected course");
        }

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new TeacherNotFoundException(
                        "Teacher not found with id: " + request.getTeacherId()));

        if (timetableRepository.existsByTeacherAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(
                teacher, request.getDayOfWeek(), request.getEndTime(), request.getStartTime())) {
            throw new IllegalStateException("Teacher already occupied");
        }
        if (!teacher.getDepartment().getId().equals(course.getDepartment().getId())) {
            throw new IllegalStateException("Teacher does not belong to selected department");
        }
        if (!teacher.getSubjects().contains(subject)) {
            throw new IllegalStateException("Teacher is not assigned to this subject");
        }

        return timetableMapper.toResponse(
                timetableRepository.save(
                        timetableMapper.toEntity(request, classroom, course, subject, teacher)
                )
        );
    }

    public TimetableResponse updateTimetable(
            Long id,
            TimetableRequest request
    ) {

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalStateException("End time must be after start time");
        }

        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() ->
                        new TimetableNotFoundException(
                                "Timetable not found with id: " + id
                        )
                );

        Classroom classroom =
                classroomRepository.findById(request.getClassroomId())
                        .orElseThrow(() ->
                                new ClassroomNotFoundException(
                                        "Classroom not found with id: "
                                                + request.getClassroomId()
                                )
                        );
        if (timetableRepository.existsByClassroomAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThanAndTimetableIdNot(
                classroom,
                request.getDayOfWeek(),
                request.getEndTime(),
                request.getStartTime(),
                id)) {
            throw new IllegalStateException(
                    "Classroom already occupied"
            );
        }

        Course course =
                courseRepository.findById(request.getCourseId())
                        .orElseThrow(() ->
                                new CourseNotFoundException(
                                        "Course not found with id: "
                                                + request.getCourseId()
                                )
                        );
        if(timetableRepository.existsByCourseAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThanAndTimetableIdNot(
                course,
                request.getDayOfWeek(),
                request.getEndTime(),
                request.getStartTime(),
                id)) {
            throw new IllegalStateException("Course already occupied");
        }

        Subject subject =
                subjectRepository.findById(request.getSubjectId())
                        .orElseThrow(() ->
                                new SubjectNotFoundException(
                                        "Subject not found with id: "
                                                + request.getSubjectId()
                                )
                        );
        if (!subject.getCourse().getId().equals(course.getId())) {
            throw new IllegalStateException(
                    "Subject does not belong to selected course"
            );
        }

        Teacher teacher =
                teacherRepository.findById(request.getTeacherId())
                        .orElseThrow(() ->
                                new TeacherNotFoundException(
                                        "Teacher not found with id: "
                                                + request.getTeacherId()
                                )
                        );
        if(timetableRepository.existsByTeacherAndDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThanAndTimetableIdNot(
                teacher,
                request.getDayOfWeek(),
                request.getEndTime(),
                request.getStartTime(),
                id)) {
            throw new IllegalStateException("Teacher already occupied");
        }
        if (!teacher.getSubjects().contains(subject)) {
            throw new IllegalStateException(
                    "Teacher is not assigned to this subject"
            );
        }
        if(!teacher.getDepartment().getId()
                .equals(course.getDepartment().getId())){
            throw new IllegalStateException("Teacher does not belong to selected department");
        }

        timetable.setDayOfWeek(request.getDayOfWeek());
        timetable.setStartTime(request.getStartTime());
        timetable.setEndTime(request.getEndTime());

        timetable.setClassroom(classroom);
        timetable.setCourse(course);
        timetable.setSubject(subject);
        timetable.setTeacher(teacher);

        return timetableMapper.toResponse(
                timetableRepository.save(timetable)
        );
    }

    public void deleteTimetable(Long id) {

        Timetable timetable =
                timetableRepository.findById(id)
                        .orElseThrow(
                                ()-> new TimetableNotFoundException("Timetable not found with id: " + id)
                        );

        timetableRepository.delete(timetable);
    }

    public Long countAll() {
        return timetableRepository.count();
    }

    public Long getTeacherStrength(Long id) {
        teacherRepository.findById(id).orElseThrow(
                ()-> new TeacherNotFoundException("Teacher not found with id: " + id)
        );
        return timetableRepository.countByTeacher_TeacherId(id);
    }

    public Long getCourseStrength(Long id) {
        courseRepository.findById(id).orElseThrow(
                ()-> new CourseNotFoundException("Course not found with id: " + id)
        );
        return timetableRepository.countByCourse_Id(id);
    }

    public Long getClassroomStrength(Long id) {
        classroomRepository.findById(id).orElseThrow(
                ()-> new ClassroomNotFoundException("Classroom not found with id: " + id)
        );
        return timetableRepository.countByClassroom_Id(id);
    }
}