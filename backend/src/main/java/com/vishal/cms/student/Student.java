package com.vishal.cms.student;

import com.vishal.cms.attendance.Attendance;
import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.department.Department;
import com.vishal.cms.enrollment.Enrollment;
import com.vishal.cms.result.Result;
import com.vishal.cms.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "student_email_unique",
                        columnNames = "email"
                ),
                @UniqueConstraint(
                        name = "student_roll_unique",
                        columnNames = "roll_number"
                )
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @Column(name = "email", unique = true)
    private String email;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private LocalDate admissionDate;

    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(
            name = "department_id",
            foreignKey = @ForeignKey(
                    name = "student_department_fk"
            )
    )
    private Department department;

    @OneToMany(
            mappedBy = "student"
    )
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "student")
    private List<Attendance> attendanceRecords = new ArrayList<>();

    @OneToMany(mappedBy = "student")
    private List<Result> results = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
