package com.vishal.cms.timetable;

import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.course.Course;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.timetable.dto.TimetableRequest;
import com.vishal.cms.timetable.dto.TimetableResponse;
import org.springframework.stereotype.Component;

@Component
public class TimetableMapper {

    public Timetable toEntity(TimetableRequest request, Classroom classroom, Course course, Subject subject, Teacher teacher) {
        Timetable timetable = new Timetable();

        timetable.setDayOfWeek(request.getDayOfWeek());
        timetable.setStartTime(request.getStartTime());
        timetable.setEndTime(request.getEndTime());

        timetable.setClassroom(classroom);
        timetable.setCourse(course);
        timetable.setSubject(subject);
        timetable.setTeacher(teacher);

        return timetable;
    }

    public TimetableResponse toResponse(Timetable timetable) {

        return TimetableResponse.builder()
                .timetableId(timetable.getTimetableId())
                .dayOfWeek(timetable.getDayOfWeek())
                .startTime(timetable.getStartTime())
                .endTime(timetable.getEndTime())

                .classroomId(
                        timetable.getClassroom() != null
                                ? timetable.getClassroom().getId()
                                : null
                )
                .classroomName(
                        timetable.getClassroom() !=null
                        ?
                        timetable.getClassroom().getRoomNumber()
                                : null
                )

                .courseId(timetable.getCourse()!=null
                        ?timetable.getCourse().getId()
                        :null)
                .courseName(
                        timetable.getCourse()!=null
                                ? timetable.getCourse().getCourseName()
                                :null
                )

                .subjectId(timetable.getSubject()!=null
                        ?timetable.getSubject().getId()
                        : null)
                .subjectName(
                        timetable.getSubject()!=null
                                ? timetable.getSubject().getSubjectName()
                                : null
                )

                .teacherId(timetable.getTeacher()!=null
                        ?timetable.getTeacher().getTeacherId()
                        : null)
                .teacherName(
                        timetable.getTeacher()!=null
                                ? timetable.getTeacher().getFirstName()
                                + " "
                                + timetable.getTeacher().getLastName()
                                : null
                )

                .createdAt(timetable.getCreatedAt())
                .updatedAt(timetable.getUpdatedAt())
                .build();
    }
}