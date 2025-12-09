package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.entity.*;
import de.assessify.app.assessifyapi.api.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import de.assessify.app.assessifyapi.api.dtos.request.AddGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.AddMembertoGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.AddProjectDto;
import de.assessify.app.assessifyapi.api.dtos.response.ProjectDto;
import de.assessify.app.assessifyapi.api.dtos.response.ProjectDtoResponse;
import de.assessify.app.assessifyapi.api.dtos.response.ProjectGroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserProjectGroupDto;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserProjectGroupRepository userProjectGroupRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new project - FIXED to use AddProjectDto
    @Transactional
    public Project createProject(AddProjectDto request) {
        Project project = new Project();
        project.setProjectName(request.name());  // Assuming AddProjectDto has name()
        project.setProjectDescription(request.description());  // Assuming AddProjectDto has description()
        project.setStartDate(request.startdate());
        project.setDeadline(request.deadline());
        project.setStatus(request.status());
        return projectRepository.save(project);
    }

    // Get all projects
    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();

        List<ProjectDto> res = projects.stream()
            .map(pd -> new ProjectDto(
                pd.getId(),
                pd.getProjectName(),
                pd.getProjectDescription(),
                pd.getDeadline(),
                pd.getStatus()
            )).toList();

        return res;
    }

    // Get project by ID
    public ProjectDtoResponse getProjectById(UUID projectId) {
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        ProjectDtoResponse res = new ProjectDtoResponse(
            project.getId(),
            project.getProjectName(),
            project.getProjectDescription(),
            project.getDeadline(),
            project.getStatus(),
            project.getTrainingModules(),
            project.getUserProjectGroups()
        );
        
        return res;
    }

    @Transactional
    public Group createGroup(AddGroupDto request) {
        // Find the project first
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + request.projectId()));

        // Create the group
        Group group = new Group();
        group.setName(request.name());
        group.setProject(project);

        // Save and return
        return groupRepository.save(group);
    }


    // Get user's current projects and groups
    public List<UserProjectGroupDto> getUserProjectGroups(UUID userId) {
        return userProjectGroupRepository.findByUserId(userId).stream()
                .map(upg -> new UserProjectGroupDto(
                upg.getId(),
                upg.getUser().getId(),
                upg.getUser().getFirstName() + " " + upg.getUser().getLastName(),
                upg.getProject().getId(),
                upg.getGroup().getId(),
                upg.getGroup().getName()
        )).collect(Collectors.toList());
    }

}
