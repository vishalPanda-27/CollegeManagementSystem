package com.vishal.cms.result;

import com.vishal.cms.result.dto.ResultResponse;
import org.springframework.stereotype.Component;

@Component
public class ResultMapper {

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