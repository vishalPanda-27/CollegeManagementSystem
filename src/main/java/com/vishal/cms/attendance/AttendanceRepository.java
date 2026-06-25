package com.vishal.cms.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {
    boolean existsByStudent_IdAndSubject_IdAndAttendanceDate(
            Long studentId,
            Long subjectId,
            LocalDate attendanceDate
    );
    boolean existsByStudent_IdAndSubject_IdAndAttendanceDateAndAttendanceIdNot(
            long studentId, Long subjectId, LocalDate attendanceDate, Long attendanceId);

    List<Attendance> findByStudent_Id(Long studentId);

    List<Attendance> findBySubject_Id(Long subjectId);

    List<Attendance> findByAttendanceDate(LocalDate date);

    List<Attendance> findByMarkedBy_TeacherId(Long teacherId);

    long countByStudent_Id(Long studentId);

    long countBySubject_Id(Long subjectId);
}