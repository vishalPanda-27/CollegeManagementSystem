package com.vishal.cms.program;

import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.ProgramNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;
    private final DepartmentRepository departmentRepository;

    public Program createProgram(
            Program program,
            Long departmentId
    ) {

        Department department =
                departmentRepository.findById(departmentId)
                        .orElseThrow(() ->
                                new DepartmentNotFoundException("Department not found with id: " + departmentId));

        program.setDepartment(department);

        return programRepository.save(program);
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Program getProgramById(Long id) {
        return programRepository.findById(id)
                .orElseThrow(() ->
                        new ProgramNotFoundException("Program not found with id: " + id));
    }

    public Program updateProgram(
            Long id,
            Program updatedProgram
    ) {

        Program program = getProgramById(id);

        program.setProgramName(
                updatedProgram.getProgramName());

        program.setProgramCode(
                updatedProgram.getProgramCode());

        program.setDurationYears(
                updatedProgram.getDurationYears());

        program.setDescription(
                updatedProgram.getDescription());

        return programRepository.save(program);
    }

    public void deleteProgram(Long id) {
        programRepository.deleteById(id);
    }
}