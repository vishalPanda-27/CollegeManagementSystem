package com.vishal.cms.course;

import com.vishal.cms.exceptions.CourseNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> findByAllCourses() {
        return  courseRepository.findAll();
    }

    public Course findByCourseId(Long courseId) {
        return courseRepository.findById(courseId).orElseThrow(
                () -> new CourseNotFoundException("Course not found with id: " + courseId)
        );
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updatedCourse) {

        Course existing = findByCourseId(id);

        existing.setCourseCode(updatedCourse.getCourseCode());
        existing.setCourseName(updatedCourse.getCourseName());
        existing.setCredits(updatedCourse.getCredits());
        existing.setSemester(updatedCourse.getSemester());
        existing.setDescription(updatedCourse.getDescription());

        return courseRepository.save(existing);
    }

    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }
}
