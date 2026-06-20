package com.vishal.cms.result;

import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.exceptions.SubjectNotFoundException;
import com.vishal.cms.result.dto.ResultRequest;
import com.vishal.cms.result.dto.ResultResponse;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ResultMapper resultMapper;

    public ResultService(
            ResultRepository resultRepository,
            StudentRepository studentRepository,
            SubjectRepository subjectRepository,
            ResultMapper resultMapper
    ) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.resultMapper = resultMapper;
    }

    public ResultResponse createResult(ResultRequest request) {

        Student student = studentRepository.findById(
                        request.getStudentId())
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + request.getStudentId()));

        Subject subject = subjectRepository.findById(
                        request.getSubjectId())
                .orElseThrow(() ->
                        new SubjectNotFoundException(
                                "Subject not found with id: "
                                        + request.getSubjectId()));

        double percentage =
                (request.getMarksObtained()
                        / request.getMaximumMarks()) * 100;

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

        String status =
                percentage >= 40 ? "PASS" : "FAIL";

        Result result = Result.builder()
                .student(student)
                .subject(subject)
                .marksObtained(request.getMarksObtained())
                .maximumMarks(request.getMaximumMarks())
                .percentage(percentage)
                .grade(grade)
                .status(status)
                .build();

        return resultMapper.toResponse(
                resultRepository.save(result)
        );
    }

    public List<ResultResponse> getAllResults() {

        return resultRepository.findAll()
                .stream()
                .map(resultMapper::toResponse)
                .toList();
    }

    public ResultResponse getResultById(Long id) {

        Result result = resultRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Result not found with id: " + id));

        return resultMapper.toResponse(result);
    }

    public List<ResultResponse> getStudentResults(
            Long studentId
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + studentId));

        return resultRepository.findByStudent(student)
                .stream()
                .map(resultMapper::toResponse)
                .toList();
    }

    public void deleteResult(Long id) {

        Result result = resultRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Result not found with id: " + id));

        resultRepository.delete(result);
    }

    public ResultResponse updateResult(
            Long id,
            ResultRequest request
    ) {

        Result result = resultRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Result not found with id: " + id));

        Student student = studentRepository.findById(
                        request.getStudentId())
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + request.getStudentId()));

        Subject subject = subjectRepository.findById(
                        request.getSubjectId())
                .orElseThrow(() ->
                        new SubjectNotFoundException(
                                "Subject not found with id: "
                                        + request.getSubjectId()));

        double percentage =
                (request.getMarksObtained()
                        / request.getMaximumMarks()) * 100;

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

        String status =
                percentage >= 40 ? "PASS" : "FAIL";

        result.setStudent(student);
        result.setSubject(subject);
        result.setMarksObtained(request.getMarksObtained());
        result.setMaximumMarks(request.getMaximumMarks());
        result.setPercentage(percentage);
        result.setGrade(grade);
        result.setStatus(status);

        return resultMapper.toResponse(
                resultRepository.save(result)
        );
    }

    public List<ResultResponse> getResultsBySubject(
            Long subjectId
    ) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() ->
                        new SubjectNotFoundException(
                                "Subject not found with id: "
                                        + subjectId));

        return resultRepository.findBySubject(subject)
                .stream()
                .map(resultMapper::toResponse)
                .toList();
    }

    public Double calculateOverallPercentage(
            Long studentId
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + studentId));

        List<Result> results =
                resultRepository.findByStudent(student);

        if (results.isEmpty()) {
            return 0.0;
        }

        double totalObtained = results.stream()
                .mapToDouble(Result::getMarksObtained)
                .sum();

        double totalMaximum = results.stream()
                .mapToDouble(Result::getMaximumMarks)
                .sum();

        return (totalObtained / totalMaximum) * 100;
    }

    public Double calculateCGPA(
            Long studentId
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: "
                                        + studentId));

        List<Result> results =
                resultRepository.findByStudent(student);

        if (results.isEmpty()) {
            return 0.0;
        }

        double totalGradePoints = 0;

        for (Result result : results) {

            double percentage = result.getPercentage();

            if (percentage >= 90) {
                totalGradePoints += 10;
            } else if (percentage >= 80) {
                totalGradePoints += 9;
            } else if (percentage >= 70) {
                totalGradePoints += 8;
            } else if (percentage >= 60) {
                totalGradePoints += 7;
            } else if (percentage >= 50) {
                totalGradePoints += 6;
            } else if (percentage >= 40) {
                totalGradePoints += 5;
            } else {
                totalGradePoints += 0;
            }
        }

        return totalGradePoints / results.size();
    }
}