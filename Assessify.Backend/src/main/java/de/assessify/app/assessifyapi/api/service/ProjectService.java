package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.request.ProjectCreateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.request.ProjectUpdateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.*;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.entity.Project;
import de.assessify.app.assessifyapi.api.mapper.GroupMapper;
import de.assessify.app.assessifyapi.api.mapper.ProjectMapper;
import de.assessify.app.assessifyapi.api.repository.GroupRepository;
import de.assessify.app.assessifyapi.api.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupRepository groupRepository;

    public ProjectResponseDto createProject(ProjectCreateRequestDto requestDTO) {
        Project project = new Project(
                requestDTO.projectName(),
                requestDTO.projectDescription(),
                requestDTO.startDate(),
                requestDTO.dueDate(),
                requestDTO.status()
        );

        if (requestDTO.status() != null) {
            project.setStatus(requestDTO.status());
        }

        Project savedProject = projectRepository.save(project);
        return ProjectMapper.toResponseDTO(savedProject);
    }

    public ProjectResponseDto getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        return ProjectMapper.toResponseDTO(project);
    }

    public List<ProjectResponseDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<GroupResponseDto> getAllGroupsByProjectId(UUID projectId){
        return groupRepository.findByProjectId(projectId).stream()
                .map(GroupMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public ProjectWithGroupsResponseDto getProjectWithGroupsByProjectId(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        return new ProjectWithGroupsResponseDto(
                project.getId(),
                project.getProjectName(),
                project.getProjectDescription(),
                project.getStartDate(),
                project.getDueDate(),
                project.getStatus(),
                project.getCreatedAt(),
                getAllGroupsByProjectId(projectId),
                project.getGroups() != null ? project.getGroups().size() : 0);

    }


    public List<ProjectWithGroupsResponseDto> getAllProjectsWithGroups(){
        List<Project> projects = projectRepository.findAll();

        return projects.stream()
                .map( project -> {
                    List<GroupResponseDto> groups = getAllGroupsByProjectId(project.getId());
                    return new ProjectWithGroupsResponseDto(
                            project.getId(),
                            project.getProjectName(),
                            project.getProjectDescription(),
                            project.getStartDate(),
                            project.getDueDate(),
                            project.getStatus(),
                            project.getCreatedAt(),
                            groups,
                            project.getGroups() != null ? project.getGroups().size() : 0
                    );
                }).collect(Collectors.toList());
    }



    public List<ProjectNamesResponseDto> getAllProjectsName() {
        return projectRepository.findAll().stream()
                .map(ProjectMapper::toNamesResponseDTO)
                .collect(Collectors.toList());
    }


    public ProjectResponseDto updateProject(UUID id, ProjectUpdateRequestDto requestDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        if (requestDTO.projectName() != null) {
            project.setProjectName(requestDTO.projectName());
        }
        if (requestDTO.projectDescription() != null) {
            project.setProjectDescription(requestDTO.projectDescription());
        }
        if (requestDTO.startDate() != null) {
            project.setStartDate(requestDTO.startDate());
        }
        if (requestDTO.dueDate() != null) {
            project.setDueDate(requestDTO.dueDate());
        }
        if (requestDTO.status() != null) {
            project.setStatus(requestDTO.status());
        }

        Project updatedProject = projectRepository.save(project);
        return ProjectMapper.toResponseDTO(updatedProject);
    }

    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

}
