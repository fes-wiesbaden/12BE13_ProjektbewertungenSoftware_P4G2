package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public class UserProjectGroupDto {
    private UUID id;
    private UUID userId;
    private String userName;
    private UUID projectId;
    private String projectName;
    private UUID groupId;
    private String groupName;
    private String role;
    
    // Constructor, getters and setters
    public UserProjectGroupDto(UUID id, UUID userId, String userName, 
                                   UUID projectId, String projectName,
                                   UUID groupId, String groupName, String role) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.projectId = projectId;
        this.projectName = projectName;
        this.groupId = groupId;
        this.groupName = groupName;
        this.role = role;
    }
    
    // All getters
    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public String getUserName() { return userName; }
    public UUID getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
    public UUID getGroupId() { return groupId; }
    public String getGroupName() { return groupName; }
    public String getRole() { return role; }
    
}
