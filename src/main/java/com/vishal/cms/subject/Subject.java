package com.vishal.cms.subject;

import com.vishal.cms.attendance.Attendance;
import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.classschedule.ClassSchedule;
import com.vishal.cms.department.Department;
import com.vishal.cms.result.Result;
import com.vishal.cms.teacher.Teacher;
import com.vishal.cms.course.Course;
import com.vishal.cms.timetable.Timetable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "subject")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String subjectCode;

    @NotBlank
    @Column(nullable = false)
    private String subjectName;

    @Min(1)
    private Integer credits;

    private Integer theoryHours;

    private Integer practicalHours;

    private Integer semester;

    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_subject_department")
    )
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_subject_course"
            ))
    private Course course;

    @ManyToMany(mappedBy = "subjects")
    private Set<Teacher> teachers = new HashSet<>();

    @OneToMany(mappedBy = "subject")
    private List<Timetable> timetables;

    @OneToMany(mappedBy = "subject")
    private List<Attendance> attendanceRecords;

    @OneToMany(mappedBy = "subject")
    private List<Result> results;

    @OneToMany(mappedBy = "subject")
    private List<ClassSchedule> schedules;
}
