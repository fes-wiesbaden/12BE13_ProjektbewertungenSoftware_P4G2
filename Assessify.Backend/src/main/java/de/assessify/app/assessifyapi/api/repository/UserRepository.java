package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    
    @Query("SELECT u FROM User u WHERE u.classEntity.id = :classId AND u.role.id = :roleId")
    List<User> findByClassIdAndRoleId(@Param("classId") UUID classId, @Param("roleId") Integer roleId);
    
    Optional<User> findByUsernameIgnoreCase(String username);
    
    @Query("SELECT u FROM User u WHERE u.role.id = :roleId")
    List<User> findByRoleId(@Param("roleId") Integer roleId);
    
    boolean existsByUsername(String username);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.id = :roleId")
    long countByRoleId(@Param("roleId") Integer roleId);
}