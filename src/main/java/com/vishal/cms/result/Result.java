package com.vishal.cms.result;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.student.Student;
import com.vishal.cms.subject.Subject;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "result",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "student_subject_result_unique",
                        columnNames = {"student_id", "subject_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @ManyToOne
    @JoinColumn(
            name = "student_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_result_student")
    )
    private Student student;

    @ManyToOne
    @JoinColumn(
            name = "subject_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_result_subject")
    )
    private Subject subject;

    @Column(nullable = false)
    private Double marksObtained;

    @Column(nullable = false)
    private Double maximumMarks;

    private Double percentage;

    private String grade;

    private String status; // PASS / FAIL
}