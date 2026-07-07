package com.vishal.cms.program;

import com.vishal.cms.program.dto.ProgramRequest;
import com.vishal.cms.program.dto.ProgramResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @PostMapping
    public ProgramResponse createProgram(
            @Valid @RequestBody ProgramRequest dto
    ) {
        return programService.createProgram(dto);
    }

    @GetMapping
    public List<ProgramResponse> getAllPrograms() {
        return programService.getAllPrograms();
    }

    @GetMapping("/{id}")
    public ProgramResponse getProgramById(
            @PathVariable Long id
    ) {
        return programService.getProgramById(id);
    }

    @GetMapping("/department/{departmentId}")
    public List<ProgramResponse> getProgramsByDepartmentId(@PathVariable Long departmentId) {
        return programService.getProgramsByDepartment(departmentId);
    }

    @PutMapping("/{id}")
    public ProgramResponse updateProgram(
            @PathVariable Long id,
            @Valid @RequestBody ProgramRequest dto
    ) {
        return programService.updateProgram(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteProgram(
            @PathVariable Long id
    ) {
        programService.deleteProgram(id);
    }
}