package com.vishal.cms.subject;

import com.vishal.cms.exceptions.SubjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    public Subject findById(Long id) {
        return subjectRepository.findById(id).orElseThrow(
                ()-> new SubjectNotFoundException("Subject not found with id: " + id)
        );
    }

    public Subject saveSubject(Subject subject) {

        if (subjectRepository.existsBySubjectCode(subject.getSubjectCode())) {
            throw new IllegalStateException("Subject code already exists");
        }

        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Long id, Subject updatedSubject) {

        Subject existing = findById(id);

        existing.setSubjectName(updatedSubject.getSubjectName());
        existing.setSubjectCode(updatedSubject.getSubjectCode());
        existing.setCredits(updatedSubject.getCredits());
        existing.setTheoryHours(updatedSubject.getTheoryHours());
        existing.setPracticalHours(updatedSubject.getPracticalHours());
        existing.setSemester(updatedSubject.getSemester());
        existing.setActive(updatedSubject.getActive());

        return subjectRepository.save(existing);
    }

    public void deleteSubject(Long id) {
        Subject subject = findById(id);
        subjectRepository.delete(subject);
    }
}
