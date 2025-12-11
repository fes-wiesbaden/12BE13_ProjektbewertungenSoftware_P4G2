package de.assessify.app.assessifyapi.api.controller.group;

import de.assessify.app.assessifyapi.api.dtos.request.GroupCreateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.request.GroupUpdateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupResponseDto;
import de.assessify.app.assessifyapi.api.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    @Autowired
    private GroupService groupService;


//    Create Group
    @PostMapping
    public ResponseEntity<GroupResponseDto> createGroup(
            @RequestBody GroupCreateRequestDto groupCreateRequestDto
    )
    {
        GroupResponseDto response = groupService.createGroup(groupCreateRequestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponseDto> getGroupById(
            @PathVariable UUID id)
    {
        GroupResponseDto response = groupService.getGroupById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<GroupResponseDto>> getAllGroups()
    {
        List<GroupResponseDto> response = groupService.getAllGroups();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponseDto> updateGroup(
            @PathVariable UUID id,
            @RequestBody GroupUpdateRequestDto requestDTO) {
        GroupResponseDto response = groupService.updateGroup(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}
