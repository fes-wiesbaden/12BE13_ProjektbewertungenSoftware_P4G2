package de.assessify.app.assessifyapi.api.controller.classteacher;

import de.assessify.app.assessifyapi.api.dtos.request.ClassTeacherAssignRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.ClassTeacherResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.ClassWithTeachersResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.TeacherSummaryDto;
import de.assessify.app.assessifyapi.api.service.ClassTeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/class-teachers")
@CrossOrigin(origins = "*")
public class ClassTeacherController {
    
    @Autowired
    private ClassTeacherService classTeacherService;
    
    // Assign a teacher to a class
    // @PostMapping
    // public ResponseEntity<ClassTeacherResponseDto> assignTeacherToClass(
    //         @RequestBody ClassTeacherAssignRequestDto requestDto) {
    //     ClassTeacherResponseDto response = classTeacherService.assignTeacherToClass(requestDto);
    //     return new ResponseEntity<>(response, HttpStatus.CREATED);
    // }
    
    // // Remove teacher from class
    // @DeleteMapping("/teacher/{teacherId}/class/{classId}")
    // public ResponseEntity<Void> removeTeacherFromClass(
    //         @PathVariable UUID teacherId,
    //         @PathVariable UUID classId) {
    //     classTeacherService.removeTeacherFromClass(teacherId, classId);
    //     return ResponseEntity.noContent().build();
    // }
    
    // Get all classes for a specific teacher
    // @GetMapping("/teacher/{teacherId}/classes")
    // public ResponseEntity<List<ClassTeacherResponseDto>> getClassesForTeacher(
    //         @PathVariable UUID teacherId) {
    //     List<ClassTeacherResponseDto> response = classTeacherService.getClassesForTeacher(teacherId);
    //     return ResponseEntity.ok(response);
    // }
    
    // // Get all teachers for a specific class
    // @GetMapping("/class/{classId}/teachers")
    // public ResponseEntity<List<TeacherSummaryDto>> getTeachersForClass(
    //         @PathVariable UUID classId) {
    //     List<TeacherSummaryDto> response = classTeacherService.getTeachersForClass(classId);
    //     return ResponseEntity.ok(response);
    // }
    
    // // Get class details with all teachers
    // @GetMapping("/class/{classId}/details")
    // public ResponseEntity<ClassWithTeachersResponseDto> getClassWithTeachers(
    //         @PathVariable UUID classId) {
    //     ClassWithTeachersResponseDto response = classTeacherService.getClassWithTeachers(classId);
    //     return ResponseEntity.ok(response);
    // }
    
    // // Get all teacher-class assignments
    // @GetMapping
    // public ResponseEntity<List<ClassTeacherResponseDto>> getAllAssignments() {
    //     List<ClassTeacherResponseDto> response = classTeacherService.getAllAssignments();
    //     return ResponseEntity.ok(response);
    // }
}