package com.vishal.cms.teacher;

import com.vishal.cms.attendance.Attendance;
import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.classschedule.ClassSchedule;
import com.vishal.cms.course.Course;
import com.vishal.cms.department.Department;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.timetable.Timetable;
import com.vishal.cms.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "teacher")
@Getter
@Setter
public class Teacher extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String phone;

    private String qualification;

    private String specialization;

    private LocalDate joiningDate;

    private Double salary;

    private boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToMany(mappedBy = "teachers")
    private Set<Course> courses = new HashSet<>();

    @OneToMany(mappedBy = "markedBy")
    private List<Attendance> attendanceRecords;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

      @ManyToMany
      @JoinTable(
              name = "teacher_subject",
              joinColumns = @JoinColumn(name = "teacher_id"),
              inverseJoinColumns = @JoinColumn(name = "subject_id")
      )
      private Set<Subject> subjects = new HashSet<>();

    @OneToMany(mappedBy = "teacher")
    private List<Timetable> timetables;

    @OneToMany(mappedBy = "teacher")
    private List<ClassSchedule> schedules;

}
