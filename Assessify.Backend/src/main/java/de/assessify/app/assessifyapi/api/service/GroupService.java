package de.assessify.app.assessifyapi.api.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.assessify.app.assessifyapi.api.dtos.request.AddMembertoGroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.ProjectGroupDto;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.entity.UserProjectGroup;
import de.assessify.app.assessifyapi.api.repository.GroupRepository;
import de.assessify.app.assessifyapi.api.repository.UserProjectGroupRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;


@Service
public class GroupService {
    
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserProjectGroupRepository userProjectGroupRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all Groups in Project
    public List<GroupDto> getAllGroupsByProjectId(UUID projectId){
        List<Group> groups = groupRepository.findByProjectId(projectId);
        

        return groups.stream()
            .map(group -> new GroupDto(
                group.getId(),
                group.getName(),
                group.getProject().getId()
            ))
            .collect(Collectors.toList());
    } 

    // Get all members in a group
    public List<UserProjectGroup> getGroupMembers(UUID groupId) {
        return userProjectGroupRepository.findByGroupId(groupId);
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

        return userProjectGroupRepository.save(userProjectGroup);
    }
}
