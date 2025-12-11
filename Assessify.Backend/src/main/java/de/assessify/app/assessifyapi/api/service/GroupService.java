package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.request.GroupCreateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.request.GroupUpdateRequestDto;
import de.assessify.app.assessifyapi.api.dtos.response.GroupResponseDto;
import de.assessify.app.assessifyapi.api.entity.Group;
import de.assessify.app.assessifyapi.api.entity.Project;
import de.assessify.app.assessifyapi.api.mapper.GroupMapper;
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
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ProjectRepository projectRepository;


    public GroupResponseDto createGroup(GroupCreateRequestDto requestDto) {
        Project project = projectRepository.findById(requestDto.projectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " +
                        "" + requestDto.projectId()));

        Group group = new Group(requestDto.groupName(), project);
        Group savedGroup = groupRepository.save(group);

        return GroupMapper.toResponseDto(savedGroup);
    }

    public GroupResponseDto getGroupById(UUID groupId) {
        Group group  = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        return GroupMapper.toResponseDto(group);
    }

    public List<GroupResponseDto> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(GroupMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public GroupResponseDto updateGroup(UUID id, GroupUpdateRequestDto requestDTO) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));

        group.setGroupName(requestDTO.groupName());
        Group updatedGroup = groupRepository.save(group);

        return GroupMapper.toResponseDto(updatedGroup);
    }

    public void deleteGroup(UUID id) {
        if (!groupRepository.existsById(id)) {
            throw new RuntimeException("Group not found with id: " + id);
        }
        groupRepository.deleteById(id);
    }

}
