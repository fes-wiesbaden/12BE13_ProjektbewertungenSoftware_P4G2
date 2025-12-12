package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record GroupMemberAddRequestDto(
    UUID memberId,
    UUID groupId
) {
    
}
