package com.vishal.cms.teacher;

import com.vishal.cms.exceptions.TeacherNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    public final TeacherRepository teacherRepository;

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }
    public Teacher findByTeacherId(Long teacherId) {
        return teacherRepository.findById(teacherId).orElseThrow(
                ()-> new TeacherNotFoundException("Teacher not found with id: " + teacherId)
        );
    }

    public Teacher saveTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public void deleteById(Long teacherId) {
        teacherRepository.deleteById(teacherId);
    }
}
