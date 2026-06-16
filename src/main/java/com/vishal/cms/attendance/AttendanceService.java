package com.vishal.cms.attendance;

import com.vishal.cms.exceptions.AttendanceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public Attendance createAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new AttendanceNotFoundException(
                                "Attendance record not found with id: " + id
                        ));
    }

    public Attendance updateAttendance(Long id, Attendance updatedAttendance) {
        Attendance attendance = getAttendanceById(id);

        attendance.setStudent(updatedAttendance.getStudent());
        attendance.setSubject(updatedAttendance.getSubject());
        attendance.setAttendanceDate(updatedAttendance.getAttendanceDate());
        attendance.setStatus(updatedAttendance.getStatus());

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = getAttendanceById(id);
        attendanceRepository.delete(attendance);
    }
}