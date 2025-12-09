package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {
    
    @Query("SELECT c FROM ClassEntity c JOIN c.students s WHERE s.id = :userId")
    List<ClassEntity> findByUserId(@Param("userId") UUID userId);
}