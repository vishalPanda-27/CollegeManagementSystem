package com.vishal.cms.enrollment;

import com.vishal.cms.enrollment.dto.EnrollmentRequest;
import com.vishal.cms.enrollment.dto.EnrollmentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public EnrollmentResponse createEnrollment(
            @Valid @RequestBody EnrollmentRequest request
    ) {

        return enrollmentService.createEnrollment(
                request
        );
    }

    @GetMapping
    public List<EnrollmentResponse> getAllEnrollments() {

        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{enrollmentId}")
    public EnrollmentResponse getEnrollmentById(
            @PathVariable Long enrollmentId
    ) {

        return enrollmentService.getEnrollmentById(
                enrollmentId
        );
    }

    @GetMapping("/student/{studentId}")
    public List<EnrollmentResponse> getStudentEnrollments(
            @PathVariable Long studentId
    ) {

        return enrollmentService.getEnrollmentsByStudent(
                studentId
        );
    }

    @GetMapping("/course/{courseId}")
    public List<EnrollmentResponse> getCourseEnrollments(
            @PathVariable Long courseId
    ) {

        return enrollmentService.getEnrollmentsByCourse(
                courseId
        );
    }

    @PutMapping("/{enrollmentId}")
    public EnrollmentResponse updateEnrollment(
            @PathVariable Long enrollmentId,
            @Valid @RequestBody EnrollmentRequest request
    ) {

        return enrollmentService.updateEnrollment(
                enrollmentId,
                request
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