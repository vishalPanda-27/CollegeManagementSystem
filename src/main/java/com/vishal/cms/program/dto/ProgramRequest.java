package com.vishal.cms.program.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramRequest {

    @NotBlank(message = "Program name is required")
    private String programName;

    @NotBlank(message = "Program code is required")
    private String programCode;

    @NotNull(message = "Duration is required")
    @Min(1)
    @Max(10)
    private Integer durationYears;

    private String description;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
}