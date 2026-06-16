package com.vishal.cms.department;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.course.Course;
import com.vishal.cms.program.Program;
import com.vishal.cms.student.Student;
import com.vishal.cms.teacher.Teacher;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "department")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Department extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    private String email;

    private String phoneNumber;


    @OneToMany(mappedBy = "department")
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Teacher> teachers = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Classroom> classrooms = new ArrayList<>();

    @OneToMany(
            mappedBy = "department",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Program> programs;

    @OneToOne
    @JoinColumn(name = "hod_id")
    private Teacher hod;
}
