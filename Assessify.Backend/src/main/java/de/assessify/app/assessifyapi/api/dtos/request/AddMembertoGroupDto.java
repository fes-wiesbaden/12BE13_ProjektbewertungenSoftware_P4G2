package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public class AddMembertoGroupDto {
    private UUID userId;
    private UUID groupId;
    private String role; // e.g., "MEMBER", "ADMIN"
    
    // Getters and setters
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getGroupId() { return groupId; }
    public void setGroupId(UUID groupId) { this.groupId = groupId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}