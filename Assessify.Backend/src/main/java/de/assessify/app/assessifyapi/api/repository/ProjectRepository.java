package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.Project;
import de.assessify.app.assessifyapi.api.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByGroupId(UUID groupId);

    // Find projects with due date before a certain date
    List<Project> findByDueDateBefore(LocalDate date);

    // Find projects with due date after a certain date
    List<Project> findByDueDateAfter(LocalDate date);

    // Find projects between dates
    List<Project> findByDueDateBetween(LocalDate startDate, LocalDate endDate);

    // Find projects by name containing (case-insensitive)
    List<Project> findByProjectNameContainingIgnoreCase(String projectName);

    // Check if project exists by name
    boolean existsByProjectName(String projectName);

    // Custom query to find projects with their group count
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.groups WHERE p.id = :projectId")
    Optional<Project> findByIdWithGroups(@Param("projectId") UUID projectId);

    // Find overdue projects (due date passed and status not completed)
    @Query("SELECT p FROM Project p WHERE p.dueDate < :currentDate AND p.status != 'COMPLETED'")
    List<Project> findOverdueProjects(@Param("currentDate") LocalDate currentDate);

    // Find projects ordered by due date
    List<Project> findAllByOrderByDueDateAsc();

    // Count projects by status
    long countByStatus(ProjectStatus status);

}