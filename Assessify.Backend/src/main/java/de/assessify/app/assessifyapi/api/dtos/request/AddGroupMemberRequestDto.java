package de.assessify.app.assessifyapi.api.dtos.request;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AddGroupMemberRequestDto(
        UUID memberId,
        UUID groupId
) {
}
