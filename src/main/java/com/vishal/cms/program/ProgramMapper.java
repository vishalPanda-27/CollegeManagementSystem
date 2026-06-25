package com.vishal.cms.program;

import com.vishal.cms.program.dto.ProgramRequest;
import com.vishal.cms.program.dto.ProgramResponse;
import org.springframework.stereotype.Component;

@Component
public class ProgramMapper {

    public Program toEntity(ProgramRequest dto) {

        if (dto == null) {
            return null;
        }

        return Program.builder()
                .programName(dto.getProgramName())
                .programCode(dto.getProgramCode())
                .durationYears(dto.getDurationYears())
                .description(dto.getDescription())
                .build();
    }

    public ProgramResponse toResponse(Program program) {

        if (program == null) {
            return null;
        }

        return ProgramResponse.builder()
                .programId(program.getProgramId())
                .programName(program.getProgramName())
                .programCode(program.getProgramCode())
                .durationYears(program.getDurationYears())
                .description(program.getDescription())
                .departmentId(
                        program.getDepartment() != null
                                ? program.getDepartment().getId()
                                : null
                )
                .departmentName(
                        program.getDepartment() != null
                                ? program.getDepartment().getName()
                                : null
                )
                .createdAt(program.getCreatedAt())
                .updatedAt(program.getUpdatedAt())
                .build();
    }
}