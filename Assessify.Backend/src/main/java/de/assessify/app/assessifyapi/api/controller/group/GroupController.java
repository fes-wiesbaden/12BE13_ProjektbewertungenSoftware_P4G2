package de.assessify.app.assessifyapi.api.controller.group;

import de.assessify.app.assessifyapi.api.dtos.request.AddGroupDto;
import de.assessify.app.assessifyapi.api.dtos.request.UpdateGroupDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupDto;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.service.EntityFinderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import de.assessify.app.assessifyapi.api.repository.GroupRepository;

@RestController
@RequestMapping("/api")
public class GroupController{

    private final GroupRepository groupRepository;
    private final EntityFinderService entityFinderService;

    public GroupController(GroupRepository groupRepository, EntityFinderService entityFinderService) {
        this.groupRepository = groupRepository;
        this.entityFinderService = entityFinderService;
    }

    @PostMapping("/group")
    public ResponseEntity<GroupDto> addNewGroup(@RequestBody AddGroupDto dto) {
        Group entity = new Group();
        entity.setName(dto.name());
        
        Group saved = groupRepository.save(entity);
            
        GroupDto response = new GroupDto(
                saved.getId(),
                saved.getName()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<GroupDto> getOneGroup(@PathVariable UUID groupId) {
        Group group = entityFinderService.findGroup(groupId);
        
        GroupDto response = new GroupDto(
                group.getId(),
                group.getName()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/groups")
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

    @PutMapping("/group/{groupId}")
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

    @DeleteMapping("/group/{groupId}")
    public ResponseEntity<Void> deleteOneGroup(@PathVariable UUID groupId) {
        Group group = entityFinderService.findGroup(groupId);
        groupRepository.delete(group);
        
        return ResponseEntity.noContent().build();
    }
}