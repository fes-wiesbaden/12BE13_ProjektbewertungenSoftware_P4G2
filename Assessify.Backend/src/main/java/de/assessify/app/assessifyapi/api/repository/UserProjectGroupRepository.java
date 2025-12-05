package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.UserProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProjectGroupRepository extends JpaRepository<UserProjectGroup, UUID> {
    List<UserProjectGroup> findByUserId(UUID userId);
    List<UserProjectGroup> findByGroupId(UUID groupId);
    List<UserProjectGroup> findByProjectId(UUID projectId);
    Optional<UserProjectGroup> findByUserIdAndGroupId(UUID userId, UUID groupId);
}