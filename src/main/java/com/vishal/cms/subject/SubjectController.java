package com.vishal.cms.subject;

import com.vishal.cms.subject.dto.SubjectRequest;
import com.vishal.cms.subject.dto.SubjectResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public List<SubjectResponse> getAllSubjects() {
        return subjectService.findAll();
    }

    @GetMapping("/{id}")
    public SubjectResponse getSubjectById(
            @PathVariable Long id
    ) {
        return subjectService.findById(id);
    }
    @GetMapping("/department/{departmentId}")
    public List<SubjectResponse> getSubjectsByDepartmentId(@PathVariable Long departmentId) {
        return subjectService.getSubjectsByDepartment(departmentId);
    }

    @GetMapping("/course/{courseId}")
    public List<SubjectResponse> getSubjectsByCourseId(@PathVariable Long courseId) {
        return subjectService.getSubjectsByCourse(courseId);
    }
    @GetMapping("/strength")
    public Long getStrengthSubjects() {
        return subjectService.countSubjects();
    }
    @GetMapping("/department/{departmentId}/strength")
    public Long getStrengthSubjectsByDepartmentId(@PathVariable Long departmentId) {
        return subjectService.countSubjectsByDepartment(departmentId);
    }
    @GetMapping("/active/strength")
    public Long getActiveStrengthSubjects() {
        return subjectService.countActiveSubjects();
    }
    @GetMapping("/inactive/strength")
    public Long getInactiveStrengthSubjects() {
        return subjectService.countInactiveSubjects();
    }
    @GetMapping("/active")
    public List<SubjectResponse> getActiveSubjects() {
        return  subjectService.getActiveSubjects();
    }
    @GetMapping("/inactive")
    public List<SubjectResponse> getInactiveSubjects() {
        return subjectService.getInactiveSubjects();
    }

    @PostMapping
    public SubjectResponse createSubject(
            @Valid @RequestBody SubjectRequest request
    ) {
        return subjectService.createSubject(request);
    }

    @PutMapping("/{id}")
    public SubjectResponse updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request
    ) {
        return subjectService.updateSubject(id, request);
    }
    @PatchMapping("/{id}/activate")
    public SubjectResponse activateSubject(@PathVariable Long id) {
        return subjectService.activateSubject(id);
    }

    @PatchMapping("/{id}/deactivate")
    public SubjectResponse deactivateSubject(@PathVariable Long id) {
        return subjectService.deactivateSubject(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSubject(
            @PathVariable Long id
    ) {
        subjectService.deleteSubject(id);
    }
}