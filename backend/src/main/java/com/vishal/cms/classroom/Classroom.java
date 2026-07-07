package com.vishal.cms.classroom;

import com.vishal.cms.audit.BaseEntity;
import com.vishal.cms.classschedule.ClassSchedule;
import com.vishal.cms.department.Department;
import com.vishal.cms.timetable.Timetable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(
        name = "classrooms",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_room_number",
                        columnNames = "room_number"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Classroom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(
            name = "room_number",
            nullable = false
    )
    private String roomNumber;

    @NotBlank
    @Column(nullable = false)
    private String buildingName;

    private Integer floor;

    @Min(30)
    @Column(nullable = false)
    private Integer capacity;

    @NotNull
    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @NotNull
    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @ManyToOne
    @JoinColumn(
            name = "department_id",
            foreignKey = @ForeignKey(
                    name = "fk_classroom_department"
            )
    )
    private Department department;

    @OneToMany(mappedBy = "classroom")
    private List<Timetable> timetables;

    @OneToMany(mappedBy = "classroom")
    private List<ClassSchedule> schedules;
}
