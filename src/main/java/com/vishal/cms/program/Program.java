package com.vishal.cms.program;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.department.Department;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(
        name = "program",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_program_code",
                        columnNames = "program_code"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long programId;

    @NotBlank
    @Column(name = "program_name", nullable = false)
    private String programName;

    @NotBlank
    @Column(name = "program_code", nullable = false, unique = true)
    private String programCode;

    @Min(1)
    @Max(10)
    @Column(name = "duration_years")
    private Integer durationYears;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "department_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_program_department")
    )
    private Department department;
}