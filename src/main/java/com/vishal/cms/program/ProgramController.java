package com.vishal.cms.program;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @PostMapping("/department/{departmentId}")
    public Program createProgram(
            @RequestBody Program program,
            @PathVariable Long departmentId
    ) {
        return programService.createProgram(
                program,
                departmentId
        );
    }

    @GetMapping
    public List<Program> getAllPrograms() {
        return programService.getAllPrograms();
    }

    @GetMapping("/{id}")
    public Program getProgramById(
            @PathVariable Long id
    ) {
        return programService.getProgramById(id);
    }

    @PutMapping("/{id}")
    public Program updateProgram(
            @PathVariable Long id,
            @RequestBody Program program
    ) {
        return programService.updateProgram(
                id,
                program
        );
    }

    @DeleteMapping("/{id}")
    public void deleteProgram(
            @PathVariable Long id
    ) {
        programService.deleteProgram(id);
    }
}