package de.assessify.app.assessifyapi.api.mapper;

import de.assessify.app.assessifyapi.api.dtos.response.ProjectNamesResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.ProjectResponseDto;
import de.assessify.app.assessifyapi.api.entity.Project;

public class ProjectMapper {
    public static ProjectResponseDto toResponseDTO(Project project) {
        if (project == null) {
            return null;
        }

        return new ProjectResponseDto(
                project.getId(),
                project.getProjectName(),
                project.getProjectDescription(),
                project.getStartDate(),
                project.getDueDate(),
                project.getStatus(),
                null,
                project.getGroups() != null ? project.getGroups().size() : 0
        );
    }

    public static ProjectNamesResponseDto toNamesResponseDTO(Project project) {
        return new ProjectNamesResponseDto(project.getId(), project.getProjectName());
    }
}
