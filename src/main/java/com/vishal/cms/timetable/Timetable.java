package com.vishal.cms.timetable;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.classroom.Classroom;
import com.vishal.cms.course.Course;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.teacher.Teacher;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(
        name = "timetable",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_classroom_day_time",
                        columnNames = {
                                "classroom_id",
                                "day_of_week",
                                "start_time"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Timetable extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timetableId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @ManyToOne
    @JoinColumn(
            name = "classroom_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_timetable_classroom")
    )
    private Classroom classroom;

    @ManyToOne
    @JoinColumn(
            name = "course_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_timetable_course")
    )
    private Course course;

    @ManyToOne
    @JoinColumn(
            name = "subject_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_timetable_subject")
    )
    private Subject subject;

    @ManyToOne
    @JoinColumn(
            name = "teacher_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_timetable_teacher")
    )
    private Teacher teacher;
}