package de.assessify.app.assessifyapi.api.controller.groupmember;

import de.assessify.app.assessifyapi.api.dtos.request.GroupMemberAddRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupMemberResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupWithMembersResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.MemberSummaryDto;
import de.assessify.app.assessifyapi.api.service.GroupMemberService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/group-members")
public class GroupMemberController {
    
    @Autowired
    private GroupMemberService groupMemberService;
    
    // Add member to group
    @PostMapping
    public ResponseEntity<GroupMemberResponseDto> addMemberToGroup(
            @RequestBody GroupMemberAddRequestDto requestDto) {
        GroupMemberResponseDto response = groupMemberService.addMemberToGroup(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    // Remove member from group
    @DeleteMapping("/member/{memberId}/group/{groupId}")
    public ResponseEntity<Void> removeMemberFromGroup(
            @PathVariable UUID memberId,
            @PathVariable UUID groupId) {
        groupMemberService.removeMemberFromGroup(memberId, groupId);
        return ResponseEntity.noContent().build();
    }
    
    // Get all members of a specific group
    @GetMapping("/group/{groupId}/members")
    public ResponseEntity<List<MemberSummaryDto>> getMembersOfGroup(
            @PathVariable UUID groupId) {
        List<MemberSummaryDto> response = groupMemberService.getMembersOfGroup(groupId);
        return ResponseEntity.ok(response);
    }
    
    // Get all groups a user is member of
    @GetMapping("/member/{memberId}/groups")
    public ResponseEntity<List<GroupMemberResponseDto>> getGroupsForMember(
            @PathVariable UUID memberId) {
        List<GroupMemberResponseDto> response = groupMemberService.getGroupsForMember(memberId);
        return ResponseEntity.ok(response);
    }
    
    // Get group details with all members
    @GetMapping("/group/{groupId}/details")
    public ResponseEntity<GroupWithMembersResponseDto> getGroupWithMembers(
            @PathVariable UUID groupId) {
        GroupWithMembersResponseDto response = groupMemberService.getGroupWithMembers(groupId);
        return ResponseEntity.ok(response);
    }

    // Get all groups details with all members
    @GetMapping("/group/details")
    public ResponseEntity<List<GroupWithMembersResponseDto>> getAllGroupsWithMembers() {
        List<GroupWithMembersResponseDto> response = groupMemberService.getAllGroupsWithMembers();
        return ResponseEntity.ok(response);
    }
    
    // Get all group memberships
    @GetMapping
    public ResponseEntity<List<GroupMemberResponseDto>> getAllMemberships() {
        List<GroupMemberResponseDto> response = groupMemberService.getAllMemberships();
        return ResponseEntity.ok(response);
    }
    
    // Get member count for a group
    @GetMapping("/group/{groupId}/count")
    public ResponseEntity<Long> getMemberCount(@PathVariable UUID groupId) {
        long count = groupMemberService.getMemberCount(groupId);
        return ResponseEntity.ok(count);
    }
}