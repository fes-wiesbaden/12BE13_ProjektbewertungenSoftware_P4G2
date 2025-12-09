package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;

public record GroupMemberResponseDto(
        Integer id,
        Integer memberId,
        String memberName,
        String memberEmail,
        Integer groupId,
        String groupName,
        LocalDateTime joinedDate,
        Integer reviewsGiven,
        Integer reviewsReceived
) {
}
