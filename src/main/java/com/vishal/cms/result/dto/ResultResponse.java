package com.vishal.cms.result.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResultResponse {

    private Long resultId;

    private Long studentId;

    private String studentName;

    private Long subjectId;

    private String subjectName;

    private Double marksObtained;

    private Double maximumMarks;

    private Double percentage;

    private String grade;

    private String status;
}