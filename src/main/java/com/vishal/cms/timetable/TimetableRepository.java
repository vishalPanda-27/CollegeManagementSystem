package com.vishal.cms.timetable;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository
        extends JpaRepository<Timetable, Long> {
}