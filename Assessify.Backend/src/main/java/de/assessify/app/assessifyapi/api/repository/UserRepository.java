package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    @Query("""
        SELECT u FROM User u
        JOIN u.schoolClasses c
        WHERE c.id = :classId
          AND u.roleId = :roleId
    """)
    List<User> findByClassIdAndRoleId(@Param("classId") UUID classId, @Param("roleId") Integer roleId);

    Optional<User> findByUsernameIgnoreCase(String username);
    List<User> findByRoleId(Integer roleId);
    boolean existsByUsername(String username);
}