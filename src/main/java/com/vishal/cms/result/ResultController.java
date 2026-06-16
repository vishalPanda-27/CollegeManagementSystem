package com.vishal.cms.result;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping
    public Result addResult(
            @RequestParam Long studentId,
            @RequestParam Long subjectId,
            @RequestParam Double marksObtained,
            @RequestParam Double maximumMarks) {

        return resultService.addResult(
                studentId,
                subjectId,
                marksObtained,
                maximumMarks
        );
    }

    @GetMapping
    public List<Result> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/student/{studentId}")
    public List<Result> getStudentResults(
            @PathVariable Long studentId) {
        return resultService.getStudentResults(studentId);
    }

    @DeleteMapping("/{id}")
    public String deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return "Result deleted successfully";
    }
}