package de.assessify.app.assessifyapi.api.controller.group;

import de.assessify.app.assessifyapi.api.dtos.request.AddGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.AddMembertoGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateGroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.UserProjectGroupResponseDto;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.entity.UserProjectGroup;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;
import de.assessify.app.assessifyapi.api.service.ProjectService;
import de.assessify.app.assessifyapi.api.service.GroupService;
import de.assessify.app.assessifyapi.api.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    
    private final GroupRepository groupRepository;
    private final EntityFinderService entityFinderService;
    private final GroupService groupService;
    
    @Autowired
    private ProjectService projectService;

    public GroupController(EntityFinderService entityFinderService, 
                          GroupRepository groupRepository, 
                          GroupService groupService) {
        this.entityFinderService = entityFinderService;
        this.groupRepository = groupRepository;
        this.groupService = groupService;
    }

    /**
     * Get all groups
     * GET /api/groups
     */
    @GetMapping
    public ResponseEntity<List<GroupDto>> getAllGroups(
            @RequestParam(required = false) UUID projectId) {
        
        // If projectId parameter is provided, filter by project
        if (projectId != null) {
            return ResponseEntity.ok(groupService.getAllGroupsByProjectId(projectId));
        }
        
        // Otherwise return all groups
        List<GroupDto> groups = groupRepository.findAll()
                .stream()
                .map(group -> new GroupDto(
                        group.getId(),
                        group.getName(),
                        group.getProject().getId()
                ))
                .toList();
        
        return ResponseEntity.ok(groups);
    }

    /**
     * Get groups by project ID
     * GET /api/groups/project/{projectId}
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<GroupDto>> getAllGroupsByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(groupService.getAllGroupsByProjectId(projectId));
    }

    /**
     * Get one group by ID
     * GET /api/groups/{groupId}
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getOneGroup(@PathVariable UUID groupId) {
        Group group = entityFinderService.findGroup(groupId);
        
        GroupDto response = new GroupDto(
                group.getId(),
                group.getName(),
                group.getProject().getId()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new group
     * POST /api/groups
     */
    @PostMapping
    public ResponseEntity<GroupDto> createGroup(@RequestBody AddGroupDto request) {
        Group group = projectService.createGroup(request);
        
        GroupDto response = new GroupDto(
                group.getId(),
                group.getName(),
                group.getProject().getId()
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update a group
     * PUT /api/groups/{groupId}
     */
    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDto> updateOneGroup(
            @PathVariable UUID groupId,
            @RequestBody UpdateGroupDto dto) {
        
        Group group = entityFinderService.findGroup(groupId);
        
        if (dto.name() != null) {
            group.setName(dto.name());
        }
        
        Group updated = groupRepository.save(group);
        
        GroupDto response = new GroupDto(
                updated.getId(),
                updated.getName(),
                updated.getProject().getId()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a group
     * DELETE /api/groups/{groupId}
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteOneGroup(@PathVariable UUID groupId) {
        Group group = entityFinderService.findGroup(groupId);
        groupRepository.delete(group);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * Add member to group
     * POST /api/groups/members
     */
    @PostMapping("/members")
    public ResponseEntity<UserProjectGroupResponseDto> addMember(@RequestBody AddMembertoGroupDto request) {
        UserProjectGroup upg = groupService.addMemberToGroup(request);
        
        UserProjectGroupResponseDto response = new UserProjectGroupResponseDto(
            upg.getId(),
            upg.getUser().getId(),
            upg.getUser().getFirstName() + " " + upg.getUser().getLastName(),
            upg.getProject().getId(),
            upg.getGroup().getId(),
            upg.getGroup().getName()
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all members in a group
     * GET /api/groups/{groupId}/members
     */
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserProjectGroupResponseDto>> getGroupMembers(@PathVariable UUID groupId) {
        List<UserProjectGroup> members = groupService.getGroupMembers(groupId);
        
        List<UserProjectGroupResponseDto> response = members.stream()
            .map(upg -> new UserProjectGroupResponseDto(
                upg.getId(),
                upg.getUser().getId(),
                upg.getUser().getFirstName() + " " + upg.getUser().getLastName(),
                upg.getProject().getId(),
                upg.getGroup().getId(),
                upg.getGroup().getName()
            ))
            .toList();
        
        return ResponseEntity.ok(response);
    }
}