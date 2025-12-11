package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<Group, UUID> {
    List<Group> findByProjectId(UUID projectId);
    boolean existsByGroupNameAndProjectId(String groupName, UUID projectId);
}
