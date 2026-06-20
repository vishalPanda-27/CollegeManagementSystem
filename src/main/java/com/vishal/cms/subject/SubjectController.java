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

    @DeleteMapping("/{id}")
    public void deleteSubject(
            @PathVariable Long id
    ) {
        subjectService.deleteSubject(id);
    }
}