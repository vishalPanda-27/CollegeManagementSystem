package com.vishal.cms.result;

import com.vishal.cms.result.dto.ResultRequest;
import com.vishal.cms.result.dto.ResultResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    public ResultResponse createResult(
            @Valid @RequestBody ResultRequest request
    ) {
        return resultService.createResult(request);
    }

    @GetMapping
    public List<ResultResponse> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{id}")
    public ResultResponse getResultById(
            @PathVariable Long id
    ) {
        return resultService.getResultById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<ResultResponse> getStudentResults(
            @PathVariable Long studentId
    ) {
        return resultService.getStudentResults(studentId);
    }

    @GetMapping("/subject/{subjectId}")
    public List<ResultResponse> getSubjectResults(@PathVariable Long subjectId) {
        return resultService.getResultsBySubject(subjectId);
    }

    @GetMapping("/student/{studentId}/percentage")
    public Double getStudentPercentage(@PathVariable Long studentId) {
        return resultService.calculateOverallPercentage(studentId);
    }

    @GetMapping("/student/{studentId}/cgpa")
    public Double getStudentCgpa(@PathVariable Long studentId) {
        return resultService.calculateCGPA(studentId);
    }

    @DeleteMapping("/{id}")
    public void deleteResult(
            @PathVariable Long id
    ) {
        resultService.deleteResult(id);
    }
    @PutMapping("/{id}")
    public ResultResponse updateResult(
            @PathVariable Long id,
            @Valid @RequestBody ResultRequest request
    ) {
        return resultService.updateResult(id, request);
    }
}