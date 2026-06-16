package com.vishal.cms.enrollment;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.course.Course;
import com.vishal.cms.student.Student;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "enrollment",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "student_course_unique",
                        columnNames = {
                                "student_id",
                                "course_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Enrollment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "course_id",
            nullable = false
    )
    private Course course;

    private LocalDate enrollmentDate;

    private String semester;

    private String academicYear;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    private Double grade;
}