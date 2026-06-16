package com.vishal.cms.enrollment;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public Enrollment createEnrollment(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestBody Enrollment enrollment
    ) {

        return enrollmentService.createEnrollment(
                studentId,
                courseId,
                enrollment
        );
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{enrollmentId}")
    public Enrollment getEnrollmentById(
            @PathVariable Long enrollmentId
    ) {

        return enrollmentService.getEnrollmentById(
                enrollmentId
        );
    }

    @GetMapping("/student/{studentId}")
    public List<Enrollment> getStudentEnrollments(
            @PathVariable Long studentId
    ) {

        return enrollmentService.getEnrollmentsByStudent(
                studentId
        );
    }

    @GetMapping("/course/{courseId}")
    public List<Enrollment> getCourseEnrollments(
            @PathVariable Long courseId
    ) {

        return enrollmentService.getEnrollmentsByCourse(
                courseId
        );
    }

    @PutMapping("/{enrollmentId}")
    public Enrollment updateEnrollment(
            @PathVariable Long enrollmentId,
            @RequestBody Enrollment enrollment
    ) {

        return enrollmentService.updateEnrollment(
                enrollmentId,
                enrollment
        );
    }

    @DeleteMapping("/{enrollmentId}")
    public void deleteEnrollment(
            @PathVariable Long enrollmentId
    ) {

        enrollmentService.deleteEnrollment(
                enrollmentId
        );
    }
}