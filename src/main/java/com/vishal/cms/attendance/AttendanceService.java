package com.vishal.cms.attendance;

import com.vishal.cms.attendance.dto.AttendanceRequest;
import com.vishal.cms.attendance.dto.AttendanceResponse;
import com.vishal.cms.exceptions.AttendanceNotFoundException;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final AttendanceMapper attendanceMapper;

    public AttendanceResponse createAttendance(
            AttendanceRequest request
    ) {

        Student student = studentRepository.findById(
                        request.getStudentId())
                .orElseThrow();

        Subject subject = subjectRepository.findById(
                        request.getSubjectId())
                .orElseThrow();

        Teacher teacher = null;

        if (request.getMarkedById() != null) {
            teacher = teacherRepository.findById(
                            request.getMarkedById())
                    .orElseThrow();
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setSubject(subject);
        attendance.setMarkedBy(teacher);
        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );
        attendance.setStatus(
                request.getStatus()
        );

        Attendance saved =
                attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(saved);
    }

    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository.findAll()
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    public AttendanceResponse getAttendanceById(
            Long id
    ) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new AttendanceNotFoundException(
                                        "Attendance not found with id "
                                                + id
                                ));

        return attendanceMapper.toResponse(
                attendance
        );
    }

    public AttendanceResponse updateAttendance(
            Long id,
            AttendanceRequest request
    ) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new AttendanceNotFoundException(
                                        "Attendance not found with id "
                                                + id
                                ));

        Student student = studentRepository.findById(
                        request.getStudentId())
                .orElseThrow();

        Subject subject = subjectRepository.findById(
                        request.getSubjectId())
                .orElseThrow();

        Teacher teacher = null;

        if (request.getMarkedById() != null) {
            teacher = teacherRepository.findById(
                            request.getMarkedById())
                    .orElseThrow();
        }

        attendance.setStudent(student);
        attendance.setSubject(subject);
        attendance.setMarkedBy(teacher);
        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );
        attendance.setStatus(
                request.getStatus()
        );

        Attendance updated =
                attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(updated);
    }

    public void deleteAttendance(Long id) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new AttendanceNotFoundException(
                                        "Attendance not found with id "
                                                + id
                                ));

        attendanceRepository.delete(attendance);
    }
}