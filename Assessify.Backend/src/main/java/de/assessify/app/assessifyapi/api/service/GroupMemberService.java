package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.request.GroupMemberAddRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupMemberResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupWithMembersResponseDto;
import de.assessify.app.assessifyapi.api.dtos.response.MemberSummaryDto;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.entity.GroupMember;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.repository.GroupMemberRepository;
import de.assessify.app.assessifyapi.api.repository.GroupRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupMemberService {

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    public GroupMemberResponseDto addMemberToGroup(GroupMemberAddRequestDto requestDto) {
        // Validate member exists
        User member = userRepository.findById(requestDto.memberId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + requestDto.memberId()));

        // Validate group exists
        Group group = groupRepository.findById(requestDto.groupId())
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + requestDto.groupId()));

        // Check if already a member
        if (groupMemberRepository.existsByMemberIdAndGroupId(
                requestDto.memberId(), requestDto.groupId())) {
            throw new RuntimeException("User is already a member of this group");
        }

        // Create membership
        GroupMember groupMember = new GroupMember(member, group);
        GroupMember saved = groupMemberRepository.save(groupMember);

        return toResponseDto(saved);
    }

    public void removeMemberFromGroup(UUID memberId, UUID groupId) {
        if (!groupMemberRepository.existsByMemberIdAndGroupId(memberId, groupId)) {
            throw new RuntimeException("Membership not found");
        }
        groupMemberRepository.deleteByMemberIdAndGroupId(memberId, groupId);
    }

    public List<MemberSummaryDto> getMembersOfGroup(UUID groupId) {
        return groupMemberRepository.findMembersByGroupIdWithDetails(groupId)
                .stream()
                .map(gm -> new MemberSummaryDto(
                gm.getMember().getId(),
                gm.getMember().getUsername(),
                gm.getMember().getFirstName() + " " + gm.getMember().getLastName(),
                gm.getMember().getRoleId()
        ))
                .collect(Collectors.toList());
    }

    public List<GroupMemberResponseDto> getGroupsForMember(UUID memberId) {
        return groupMemberRepository.findGroupsByMemberIdWithDetails(memberId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public GroupWithMembersResponseDto getGroupWithMembers(UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        List<MemberSummaryDto> members = getMembersOfGroup(groupId);

        return new GroupWithMembersResponseDto(
                group.getId(),
                group.getGroupName(),
                group.getProject().getId(),
                group.getProject() != null ? group.getProject().getProjectName() : null,
                members,
                members.size()
        );
    }

    public List<GroupMemberResponseDto> getAllMemberships() {
        return groupMemberRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Helper method
    private GroupMemberResponseDto toResponseDto(GroupMember groupMember) {
        User member = groupMember.getMember();
        Group group = groupMember.getGroup();

        return new GroupMemberResponseDto(
                groupMember.getId(),
                member.getId(),
                member.getUsername(),
                member.getFirstName() + " " + member.getLastName(),
                member.getRoleId(),
                group.getId(),
                group.getGroupName(),
                groupMember.getJoinedDate()
        );
    }

    public Long getMemberCount(UUID groupId) {
        // Verify group exists
        if (!groupRepository.existsById(groupId)) {
            throw new RuntimeException("Group not found with id: " + groupId);
        }

        return groupMemberRepository.countByGroupId(groupId);
    }
}
