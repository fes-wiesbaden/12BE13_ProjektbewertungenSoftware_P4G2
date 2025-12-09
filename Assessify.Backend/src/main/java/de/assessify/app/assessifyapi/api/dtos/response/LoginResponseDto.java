package de.assessify.app.assessifyapi.api.dtos.response;

public record LoginResponseDto(String token, UserResponseDto user, String tokenType) {
}