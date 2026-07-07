package com.vishal.cms.program;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgramRepository
        extends JpaRepository<Program, Long> {

    boolean existsByProgramCode(String programCode);

    Optional<Program> findByProgramCode(String programCode);

    List<Program> findByDepartmentId(Long departmentId);
}