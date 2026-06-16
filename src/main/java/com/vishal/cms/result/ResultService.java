package com.vishal.cms.result;

import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.exceptions.SubjectNotFoundException;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public ResultService(ResultRepository resultRepository,
                         StudentRepository studentRepository,
                         SubjectRepository subjectRepository) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    public Result addResult(Long studentId,
                            Long subjectId,
                            Double marksObtained,
                            Double maximumMarks) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + studentId));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with id: " + subjectId));

        double percentage = (marksObtained / maximumMarks) * 100;

        String grade;
        if (percentage >= 90) {
            grade = "A+";
        } else if (percentage >= 80) {
            grade = "A";
        } else if (percentage >= 70) {
            grade = "B";
        } else if (percentage >= 60) {
            grade = "C";
        } else if (percentage >= 40) {
            grade = "D";
        } else {
            grade = "F";
        }

        String status = percentage >= 40 ? "PASS" : "FAIL";

        Result result = Result.builder()
                .student(student)
                .subject(subject)
                .marksObtained(marksObtained)
                .maximumMarks(maximumMarks)
                .percentage(percentage)
                .grade(grade)
                .status(status)
                .build();

        return resultRepository.save(result);
    }

    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    public List<Result> getStudentResults(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + studentId));

        return resultRepository.findByStudent(student);
    }

    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }
}