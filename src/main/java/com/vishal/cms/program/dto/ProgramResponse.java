package com.vishal.cms.program.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramResponse {

    private Long programId;

    private String programName;

    private String programCode;

    private Integer durationYears;

    private String description;

    private Long departmentId;

    private String departmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}