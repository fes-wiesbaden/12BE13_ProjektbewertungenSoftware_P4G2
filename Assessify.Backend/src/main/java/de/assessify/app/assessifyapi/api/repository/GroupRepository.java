package de.assessify.app.assessifyapi.api.repository;

import java.util.List;

import de.assessify.app.assessifyapi.api.entity.Group;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {
    List<Group> findByProjectId(UUID projectId);
    // JpaRepository provides findAll(), save(), delete(), etc.
}