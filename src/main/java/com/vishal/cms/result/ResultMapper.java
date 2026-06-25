package com.vishal.cms.result;

import com.vishal.cms.result.dto.ResultRequest;
import com.vishal.cms.result.dto.ResultResponse;
import com.vishal.cms.student.Student;
import com.vishal.cms.subject.Subject;
import org.springframework.stereotype.Component;

@Component
public class ResultMapper {
    public Result toEntity(ResultRequest request, Student student, Subject subject, double percentage, String grade, ResultStatus status) {
        Result result = new Result();
        result.setStudent(student);
        result.setSubject(subject);
        result.setMaximumMarks(request.getMaximumMarks());
        result.setMarksObtained(request.getMarksObtained());
        result.setPercentage(percentage);
        result.setGrade(grade);
        result.setStatus(status);
        return result;
    }

    public ResultResponse toResponse(Result result) {

        return ResultResponse.builder()
                .resultId(result.getResultId())
                .studentId(result.getStudent().getId())
                .studentName(
                        result.getStudent().getFirstName()
                                + " "
                                + result.getStudent().getLastName()
                )
                .subjectId(result.getSubject().getId())
                .subjectName(result.getSubject().getSubjectName())
                .marksObtained(result.getMarksObtained())
                .maximumMarks(result.getMaximumMarks())
                .percentage(result.getPercentage())
                .grade(result.getGrade())
                .status(result.getStatus())
                .build();
    }
}