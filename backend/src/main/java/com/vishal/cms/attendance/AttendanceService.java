package com.vishal.cms.attendance;

import com.vishal.cms.attendance.dto.AttendanceRequest;
import com.vishal.cms.attendance.dto.AttendanceResponse;
import com.vishal.cms.enrollment.EnrollmentRepository;
import com.vishal.cms.exceptions.AttendanceNotFoundException;
import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.exceptions.SubjectNotFoundException;
import com.vishal.cms.exceptions.TeacherNotFoundException;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.teacher.TeacherRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceMapper attendanceMapper;

    public AttendanceResponse createAttendance(
            AttendanceRequest request
    ) {

        Student student = studentRepository.findById(
                        request.getStudentId())
                .orElseThrow(
                        () ->
                                new StudentNotFoundException(
                                        "Student not found with id: "
                                                + request.getStudentId()
                                )
                );

        Subject subject = subjectRepository.findById(
                        request.getSubjectId())
                .orElseThrow(
                        () ->
                                new SubjectNotFoundException(
                                        "Subject not found with id: "
                                                + request.getSubjectId()
                                )
                );

        Teacher teacher = null;

        if (request.getMarkedById() != null) {
            teacher = teacherRepository.findById(
                            request.getMarkedById())
                    .orElseThrow(
                            ()-> new TeacherNotFoundException("Teacher not found with id : "+request.getMarkedById())
                    );
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
        if (attendanceRepository
                .existsByStudent_IdAndSubject_IdAndAttendanceDate(
                        request.getStudentId(),
                        request.getSubjectId(),
                        request.getAttendanceDate()
                )) {

            throw new IllegalStateException(
                    "Attendance already marked"
            );
        }
        if (!enrollmentRepository.existsByStudent_IdAndCourse_Id(
                student.getId(),
                subject.getCourse().getId()
        )) {

            throw new IllegalStateException(
                    "Student is not enrolled in this course"
            );
        }
        if (teacher != null &&
                !teacher.getSubjects().contains(subject)) {

            throw new IllegalStateException(
                    "Teacher cannot mark attendance for this subject"
            );
        }

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
                .orElseThrow(
                        () ->
                                new StudentNotFoundException(
                                        "Student not found with id: "
                                                + request.getStudentId()
                                )
                );

        Subject subject = subjectRepository.findById(
                        request.getSubjectId())
                .orElseThrow(
                        () ->
                                new SubjectNotFoundException(
                                        "Subject not found with id: "
                                                + request.getSubjectId()
                                )
                );

        Teacher teacher = null;

        if (request.getMarkedById() != null) {
            teacher = teacherRepository.findById(
                            request.getMarkedById())
                    .orElseThrow(
                            ()-> new TeacherNotFoundException("Teacher not found with id : "+request.getMarkedById())
                    );
        }

        if (!enrollmentRepository.existsByStudent_IdAndCourse_Id(
                student.getId(),
                subject.getCourse().getId()
        )) {

            throw new IllegalStateException(
                    "Student is not enrolled in this course"
            );
        }
        if (teacher != null &&
                !teacher.getSubjects().contains(subject)) {

            throw new IllegalStateException(
                    "Teacher cannot mark attendance for this subject"
            );
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
        if(attendanceRepository.existsByStudent_IdAndSubject_IdAndAttendanceDateAndAttendanceIdNot(
                request.getStudentId(),
                request.getSubjectId(),
                request.getAttendanceDate(),
                id
        )){
            throw new IllegalStateException("Attendance already marked");
        }

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

    public List<AttendanceResponse> getAttendanceOfStudent(Long studentId) {
        studentRepository.findById(studentId).orElseThrow(
                () -> new StudentNotFoundException("Student not found with id: " + studentId)
        );
        return attendanceRepository.findByStudent_Id(studentId)
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getAttendanceOfSubject(Long subjectId) {
        subjectRepository.findById(subjectId).orElseThrow(
                () -> new SubjectNotFoundException("Subject not found: " + subjectId)
        );
        return attendanceRepository.findBySubject_Id(subjectId)
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();

    }

    public List<AttendanceResponse> getAttendanceByTeacher(Long teacherId) {
        teacherRepository.findById(teacherId).orElseThrow(
                () -> new TeacherNotFoundException("Teacher not found: " + teacherId)
        );
        return attendanceRepository.findByMarkedBy_TeacherId(teacherId)
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getAttendanceOn(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date)
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }
}