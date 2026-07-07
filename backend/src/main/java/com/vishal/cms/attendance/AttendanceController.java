package com.vishal.cms.attendance;

import com.vishal.cms.attendance.dto.AttendanceRequest;
import com.vishal.cms.attendance.dto.AttendanceResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public AttendanceResponse createAttendance(
            @Valid @RequestBody AttendanceRequest request
    ) {
        return attendanceService.createAttendance(
                request
        );
    }

    @GetMapping
    public List<AttendanceResponse> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/{id}")
    public AttendanceResponse getAttendanceById(
            @PathVariable Long id
    ) {
        return attendanceService.getAttendanceById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<AttendanceResponse> getAttendanceByStudentId(@PathVariable Long studentId) {
        return attendanceService.getAttendanceOfStudent(studentId);
    }

    @GetMapping("subject/{subjectId}")
    public List<AttendanceResponse> getAttendanceBySubjectId(@PathVariable Long subjectId) {
        return attendanceService.getAttendanceOfSubject(subjectId);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<AttendanceResponse> getAttendanceByTeacherId(@PathVariable Long teacherId) {
        return attendanceService.getAttendanceByTeacher(teacherId);
    }

    @GetMapping("date/{date}")
    public List<AttendanceResponse> getAttendanceByDate(@PathVariable LocalDate date) {
        return attendanceService.getAttendanceOn(date);
    }


    @PutMapping("/{id}")
    public AttendanceResponse updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request
    ) {
        return attendanceService.updateAttendance(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    public void deleteAttendance(
            @PathVariable Long id
    ) {
        attendanceService.deleteAttendance(id);
    }
}