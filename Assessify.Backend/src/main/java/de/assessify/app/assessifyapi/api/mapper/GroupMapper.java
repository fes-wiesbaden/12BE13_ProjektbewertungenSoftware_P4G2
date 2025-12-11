package de.assessify.app.assessifyapi.api.mapper;

import de.assessify.app.assessifyapi.api.dtos.response.GroupResponseDto;
import de.assessify.app.assessifyapi.api.entity.Group;

public class GroupMapper {
    public static GroupResponseDto toResponseDto(Group group){
        if (group == null){
            return null;
        }

        return new GroupResponseDto(
                group.getId(),
                group.getGroupName(),
                group.getProject().getId(),
                group.getProject().getProjectName(),
                group.getCreatedAt()
        );
    }


}
