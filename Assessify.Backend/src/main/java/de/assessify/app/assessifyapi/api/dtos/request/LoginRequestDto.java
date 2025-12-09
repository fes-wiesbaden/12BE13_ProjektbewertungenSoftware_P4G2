package de.assessify.app.assessifyapi.api.dtos.request;

import lombok.Builder;

@Builder
public record LoginRequestDto(String username, String password) {
    
}
