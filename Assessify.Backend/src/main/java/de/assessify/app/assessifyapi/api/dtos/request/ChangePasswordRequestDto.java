package de.assessify.app.assessifyapi.api.dtos.request;

public record ChangePasswordRequestDto(
        String oldPassword,
        String newPassword
) {}
