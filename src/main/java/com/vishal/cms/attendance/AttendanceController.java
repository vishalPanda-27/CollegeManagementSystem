package com.vishal.cms.attendance;

import com.vishal.cms.attendance.dto.AttendanceRequest;
import com.vishal.cms.attendance.dto.AttendanceResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public String deleteAttendance(
            @PathVariable Long id
    ) {
        attendanceService.deleteAttendance(id);
        return "Attendance deleted successfully";
    }
}