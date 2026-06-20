package com.vishal.cms.course;

import com.vishal.cms.course.dto.CourseRequest;
import com.vishal.cms.course.dto.CourseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(
            @PathVariable Long id
    ) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public CourseResponse createCourse(
            @Valid @RequestBody CourseRequest request
    ) {
        return courseService.createCourse(request);
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request
    ) {
        return courseService.updateCourse(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(
            @PathVariable Long id
    ) {
        courseService.deleteCourse(id);
    }
}