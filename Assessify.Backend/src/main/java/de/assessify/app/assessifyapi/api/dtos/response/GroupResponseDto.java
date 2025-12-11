package de.assessify.app.assessifyapi.api.dtos.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.UUID;

public class GroupResponseDto{
    private UUID id;
    private String groupName;
    private UUID projectId;
    private String projectName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public GroupResponseDto(){}

    public GroupResponseDto(UUID id, String groupName, UUID projectId, String projectName, LocalDateTime createdAt) {
        this.id = id;
        this.groupName = groupName;
        this.projectId = projectId;
        this.projectName = projectName;
        this.createdAt = createdAt;

    }
}
