package com.vishal.cms.student;

import com.vishal.cms.exceptions.StudentNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElseThrow(
                ()-> new StudentNotFoundException("Student not found with id: " + id)
        );
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new StudentNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        studentRepository.delete(student);
    }

    public Student updateStudent(Long id, Student updatedStudent){

        Student student = getStudentById(id);

        student.setFirstName(updatedStudent.getFirstName());
        student.setLastName(updatedStudent.getLastName());
        student.setEmail(updatedStudent.getEmail());
        student.setPhoneNumber(updatedStudent.getPhoneNumber());

        return studentRepository.save(student);
    }

}
