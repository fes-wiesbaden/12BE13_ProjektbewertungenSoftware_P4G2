package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

public record GroupMemberResponseDto(
    UUID id, 
    UUID memberId,
    String memberUsername,
    String memberFullName,
    Integer memberRoleId,
    UUID groupId,
    String groupName,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime joinedDate
) {
    
}
