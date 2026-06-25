package com.vishal.cms.result;

import com.vishal.cms.exceptions.ResultNotFoundException;
import com.vishal.cms.exceptions.StudentNotFoundException;
import com.vishal.cms.exceptions.SubjectNotFoundException;
import com.vishal.cms.result.dto.ResultRequest;
import com.vishal.cms.result.dto.ResultResponse;
import com.vishal.cms.student.Student;
import com.vishal.cms.student.StudentRepository;
import com.vishal.cms.subject.Subject;
import com.vishal.cms.subject.SubjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ResultMapper resultMapper;

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

        if (resultRepository.existsByStudentAndSubject(
                student,
                subject
        )) {
            throw new IllegalStateException(
                    "Result already exists for this student and subject"
            );
        }

        if (
                request.getMarksObtained() >
                        request.getMaximumMarks()
        ) {
            throw new IllegalStateException(
                    "Marks obtained cannot exceed maximum marks"
            );
        }
        double percentage =
                (request.getMarksObtained()
                        / request.getMaximumMarks()) * 100;

        String grade=calculateGrade(percentage);


        ResultStatus status =
                percentage >= 40 ? ResultStatus.PASS : ResultStatus.FAIL;

        Result result = resultMapper.toEntity(request,student,subject,percentage,grade,status);

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
                        new ResultNotFoundException(
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
                        new ResultNotFoundException(
                                "Result not found with id: " + id));

        resultRepository.delete(result);
    }

    public ResultResponse updateResult(
            Long id,
            ResultRequest request
    ) {

        Result result = resultRepository.findById(id)
                .orElseThrow(() ->
                        new ResultNotFoundException(
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

        Result existing =
                resultRepository.findByStudentAndSubject(
                        student,
                        subject
                ).orElse(null);

        if (
                existing != null &&
                        !existing.getResultId().equals(id)
        ) {
            throw new IllegalStateException(
                    "Result already exists for this student and subject"
            );
        }

        if (
                request.getMarksObtained() >
                        request.getMaximumMarks()
        ) {
            throw new IllegalStateException(
                    "Marks obtained cannot exceed maximum marks"
            );
        }

        double percentage =
                (request.getMarksObtained()
                        / request.getMaximumMarks()) * 100;

        ResultStatus status =
                percentage >= 40 ? ResultStatus.PASS : ResultStatus.FAIL;

        String grade = calculateGrade(percentage);

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

    private String calculateGrade(double percentage) {
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
        return grade;
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
            throw new IllegalStateException(
                    "No results available for student"
            );
        }

        double totalGradePoints = calculateGradePoints(results);

        return totalGradePoints / results.size();
    }

    private double calculateGradePoints(List<Result> results) {
        double gradePoints = 0;
        for (Result result : results) {
            double percentage = result.getPercentage();

            if (percentage >= 90) {
                gradePoints += 10;
            } else if (percentage >= 80) {
                gradePoints += 9;
            } else if (percentage >= 70) {
                gradePoints += 8;
            } else if (percentage >= 60) {
                gradePoints += 7;
            } else if (percentage >= 50) {
                gradePoints += 6;
            } else if (percentage >= 40) {
                gradePoints += 5;
            } else {
                gradePoints += 0;
            }
        }
        return gradePoints;
    }
}