package de.assessify.app.assessifyapi.api.dtos.request;

import org.antlr.v4.runtime.misc.NotNull;

public record UserRequestDto (
    String firstName,
    
    String lastName,
    
    String username,
        
    String password,
    
    Integer roleId,
    
    Integer classId, // Optional for students
    
    Boolean isActive) {
    
}
