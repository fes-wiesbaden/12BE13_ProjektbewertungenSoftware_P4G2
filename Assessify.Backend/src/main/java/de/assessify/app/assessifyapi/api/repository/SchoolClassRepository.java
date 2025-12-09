package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {
    List<ClassEntity> findByUsers_Id(UUID userId);
}