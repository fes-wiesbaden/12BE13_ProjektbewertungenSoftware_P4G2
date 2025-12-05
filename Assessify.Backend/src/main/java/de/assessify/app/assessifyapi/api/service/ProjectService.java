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
        return projectRepository.save(project);
    }
    
    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    // Get project by ID
    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }
    
    // Get all groups in a project
    public List<Group> getProjectGroups(UUID projectId) {
        return groupRepository.findByProjectId(projectId);
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
    
    // Add a member to a group
    @Transactional
    public UserProjectGroup addMemberToGroup(AddMembertoGroupDto request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Group group = groupRepository.findById(request.getGroupId())
            .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is already in the group
        userProjectGroupRepository.findByUserIdAndGroupId(request.getUserId(), request.getGroupId())
            .ifPresent(upg -> {
                throw new RuntimeException("User already in this group");
            });
        
        UserProjectGroup userProjectGroup = new UserProjectGroup();
        userProjectGroup.setUser(user);
        userProjectGroup.setGroup(group);
        userProjectGroup.setProject(group.getProject());
        userProjectGroup.setRole(request.getRole() != null ? request.getRole() : "MEMBER");
        
        return userProjectGroupRepository.save(userProjectGroup);
    }
    
 
    
    // Get all members in a group
    public List<UserProjectGroup> getGroupMembers(UUID groupId) {
        return userProjectGroupRepository.findByGroupId(groupId);
    }
    
    // Get user's current projects and groups
    public List<UserProjectGroupDto> getUserProjectGroups(UUID userId) {
        return userProjectGroupRepository.findByUserId(userId).stream()
            .map(upg -> new UserProjectGroupDto(
                upg.getId(),
                upg.getUser().getId(),
                upg.getUser().getFirstName() + " " + upg.getUser().getLastName(),
                upg.getProject().getId(),
                upg.getProject().getProjectName(),
                upg.getGroup().getId(),
                upg.getGroup().getName(),
                upg.getRole()
            ))
            .collect(Collectors.toList());
    }
    
    

}