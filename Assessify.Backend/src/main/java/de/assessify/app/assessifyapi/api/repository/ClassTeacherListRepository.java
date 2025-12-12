package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.ClassTeacherList;
import de.assessify.app.assessifyapi.api.entity.SchoolClass;
import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassTeacherListRepository extends JpaRepository<ClassTeacherList, UUID> {
    
    // Find all assignments for a specific teacher
    List<ClassTeacherList> findByTeacherId(UUID teacherId);
    
    // Find all assignments for a specific class
    List<ClassTeacherList> findBySchoolClassId(UUID classId);
    
    // Check if teacher is already assigned to class
    boolean existsByTeacherIdAndSchoolClassId(UUID teacherId, UUID classId);
    
    // Find specific assignment
    Optional<ClassTeacherList> findByTeacherIdAndSchoolClassId(UUID teacherId, UUID classId);
    
    // Delete assignment
    void deleteByTeacherIdAndSchoolClassId(UUID teacherId, UUID classId);
    
    // Find all classes for a teacher with details
    @Query("SELECT ctl FROM ClassTeacherList ctl " +
           "JOIN FETCH ctl.schoolClass " +
           "WHERE ctl.teacher.id = :teacherId")
    List<ClassTeacherList> findClassesByTeacherIdWithDetails(@Param("teacherId") UUID teacherId);
    
    // Find all teachers for a class with details
    @Query("SELECT ctl FROM ClassTeacherList ctl " +
           "JOIN FETCH ctl.teacher " +
           "WHERE ctl.schoolClass.id = :classId")
    List<ClassTeacherList> findTeachersByClassIdWithDetails(@Param("classId") UUID classId);
}