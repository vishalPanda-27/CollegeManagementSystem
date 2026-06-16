package com.vishal.cms.course;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.enrollment.Enrollment;
import com.vishal.cms.timetable.Timetable;
import jakarta.persistence.Entity;

import com.vishal.cms.department.Department;
import com.vishal.cms.teacher.Teacher;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "course",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "course_code_unique",
                        columnNames = "course_code"
                )
        })
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Course extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String courseCode;

    @Column(nullable = false)
    @NotBlank
    private String courseName;

    private Integer credits;

    private Integer semester;

    private String description;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToMany
    @JoinTable(
            name = "teacher_course",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<Teacher> teachers = new HashSet<>();

    @OneToMany(
            mappedBy = "course",
            cascade = CascadeType.ALL
    )
    private List<Enrollment> enrollments;

    @OneToMany(mappedBy = "course")
    private List<Timetable> timetables;

}
