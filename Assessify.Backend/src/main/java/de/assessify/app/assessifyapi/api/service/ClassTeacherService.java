package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.response.ClassTeacherResponseDto;
import de.assessify.app.assessifyapi.api.repository.ClassTeacherListRepository;
import de.assessify.app.assessifyapi.api.repository.SchoolClassRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClassTeacherService {
    
    @Autowired
    private ClassTeacherListRepository classTeacherListRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SchoolClassRepository schoolClassRepository;
    
    public List<ClassTeacherResponseDto> getClassesForTeacher(UUID teacherId) {
        return classTeacherListRepository.findClassesByTeacherIdWithDetails(teacherId)
            .stream()
            .map(teacher -> new ClassTeacherResponseDto(
                teacher.getId(),
            teacher.getTeacher().getId(),
            teacher.getTeacher().getUsername(),
            teacher.getSchoolClass().getId(),
            teacher.getSchoolClass().getClassName(),
            teacher.getSchoolClass().getCourseName(),
            teacher.getAssignedDate()
            ))
            .collect(Collectors.toList());
    }
}