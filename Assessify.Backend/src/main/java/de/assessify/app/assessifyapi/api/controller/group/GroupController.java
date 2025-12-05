package de.assessify.app.assessifyapi.api.controller.group;

import de.assessify.app.assessifyapi.api.dtos.request.AddGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.AddMembertoGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateGroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserProjectGroupResponseDto;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.entity.Project;
import de.assessify.app.assessifyapi.api.entity.UserProjectGroup;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.service.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import de.assessify.app.assessifyapi.api.repository.GroupRepository;

@RestController
@RequestMapping("/api/groups")
public class GroupController{

    private final GroupRepository groupRepository;
    private final EntityFinderService entityFinderService;

    public GroupController(GroupRepository groupRepository, EntityFinderService entityFinderService) {
        this.groupRepository = groupRepository;
        this.entityFinderService = entityFinderService;
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getOneGroup(@PathVariable UUID groupId) {
        Group group = entityFinderService.findGroup(groupId);
        
        GroupDto response = new GroupDto(
                group.getId(),
                group.getName()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<GroupDto>> getAllGroups() {
        List<GroupDto> groups = groupRepository.findAll()
                .stream()
                .map(group -> new GroupDto(
                        group.getId(),
                        group.getName()
                ))
                .toList();
        
        return ResponseEntity.ok(groups);
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDto> updateOneGroup(
            @PathVariable UUID groupId,
            @RequestBody UpdateGroupDto dto) {
        
        Group group = entityFinderService.findGroup(groupId);
        
        if (dto.name() != null) group.setName(dto.name());
        
        Group updated = groupRepository.save(group);
        
        GroupDto response = new GroupDto(
                updated.getId(),
                updated.getName()
        );
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteOneGroup(@PathVariable UUID groupId) {
        Group group = entityFinderService.findGroup(groupId);
        groupRepository.delete(group);
        
        return ResponseEntity.noContent().build();
    }




    @Autowired
    private ProjectService projectService;
    
    // Create a new group (in a project)
    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody AddGroupDto request) {
        Group group = projectService.createGroup(request);
        return new ResponseEntity<>(group, HttpStatus.CREATED);
    }
    
    // Add member to group - FIXED to return DTO
    @PostMapping("/members")
    public ResponseEntity<UserProjectGroupResponseDto> addMember(@RequestBody AddMembertoGroupDto request) {
        UserProjectGroup upg = projectService.addMemberToGroup(request);
        
        // Convert to DTO to avoid circular reference
        UserProjectGroupResponseDto response = new UserProjectGroupResponseDto(
            upg.getId(),
            upg.getUser().getId(),
            upg.getUser().getFirstName() + " " + upg.getUser().getLastName(),
            upg.getProject().getId(),
            upg.getProject().getProjectName(),
            upg.getGroup().getId(),
            upg.getGroup().getName(),
            upg.getRole()
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    // Get all members in a group - FIXED to return DTOs
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserProjectGroupResponseDto>> getGroupMembers(@PathVariable UUID groupId) {
        List<UserProjectGroup> members = projectService.getGroupMembers(groupId);
        
        List<UserProjectGroupResponseDto> response = members.stream()
            .map(upg -> new UserProjectGroupResponseDto(
                upg.getId(),
                upg.getUser().getId(),
                upg.getUser().getFirstName() + " " + upg.getUser().getLastName(),
                upg.getProject().getId(),
                upg.getProject().getProjectName(),
                upg.getGroup().getId(),
                upg.getGroup().getName(),
                upg.getRole()
            ))
            .toList();
        
        return ResponseEntity.ok(response);
    }
   


}