package  com.vishal.cms.program;

import com.vishal.cms.department.Department;
import com.vishal.cms.department.DepartmentRepository;
import com.vishal.cms.exceptions.DepartmentNotFoundException;
import com.vishal.cms.exceptions.ProgramNotFoundException;
import com.vishal.cms.program.Program;
import com.vishal.cms.program.ProgramMapper;
import com.vishal.cms.program.ProgramRepository;
import com.vishal.cms.program.dto.ProgramRequest;
import com.vishal.cms.program.dto.ProgramResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final DepartmentRepository departmentRepository;
    private final ProgramMapper programMapper;

    public ProgramResponse createProgram(
            ProgramRequest request
    ) {

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id: " + request.getDepartmentId()));

        if (programRepository.existsByProgramCode(request.getProgramCode())) {
            throw new IllegalStateException(
                    "Program code already exists"
            );
        }

        Program program = programMapper.toEntity(request);
        program.setDepartment(department);

        return programMapper.toResponse(
                programRepository.save(program)
        );
    }

    public List<ProgramResponse> getAllPrograms() {
        return programRepository.findAll()
                .stream()
                .map(programMapper::toResponse)
                .toList();
    }
    public List<ProgramResponse> getProgramsByDepartment(Long departmentId){
        departmentRepository.findById(departmentId)
                .orElseThrow(
                        () -> new DepartmentNotFoundException(
                                "Department not found with id: " + departmentId
                        )
                );
        return programRepository.findByDepartmentId(departmentId)
                .stream()
                .map(programMapper::toResponse)
                .toList();
    }

    public ProgramResponse getProgramById(Long id) {

        Program program = programRepository.findById(id)
                .orElseThrow(() ->
                        new ProgramNotFoundException(
                                "Program not found with id: " + id));

        return programMapper.toResponse(program);
    }

    public ProgramResponse updateProgram(
            Long id,
            ProgramRequest request
    ) {

        Program program = programRepository.findById(id)
                .orElseThrow(() ->
                        new ProgramNotFoundException(
                                "Program not found with id: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id: " + request.getDepartmentId()));

        Program existing =
                programRepository
                        .findByProgramCode(
                                request.getProgramCode()
                        )
                        .orElse(null);

        if (
                existing != null &&
                        !existing.getProgramId().equals(id)
        ) {
            throw new IllegalStateException(
                    "Program code already exists"
            );
        }

        program.setProgramName(request.getProgramName());
        program.setProgramCode(request.getProgramCode());
        program.setDurationYears(request.getDurationYears());
        program.setDescription(request.getDescription());
        program.setDepartment(department);

        return programMapper.toResponse(
                programRepository.save(program)
        );
    }

    public void deleteProgram(Long id) {

        Program program =
                programRepository.findById(id)
                        .orElseThrow(
                                ()-> new ProgramNotFoundException("Program does not exist with id : "+id)
                        );

        programRepository.delete(program);
    }
}