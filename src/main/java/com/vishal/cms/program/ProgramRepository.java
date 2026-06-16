package com.vishal.cms.program;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository
        extends JpaRepository<Program, Long> {

    boolean existsByProgramCode(String programCode);
}