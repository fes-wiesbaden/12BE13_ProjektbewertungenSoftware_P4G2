# Overview 

This API provides endpoints for managing users, roles, training modules, grades, projects, and reviews.
All endpoints are prefixed with:

```http
/api
```

The API follows REST conventions and uses JSON for request and response bodies.

# Endpoints

## User Endpoints

### GET /api/users

📝 Description
Retrieves a list of all registered users in the system.

✅ Response — 200 OK
A list of users, each containing basic user information.

Response Example
```json 
[
  {
    "id": "6f83cbe8-26c3-4a71-bf0e-35e58acb9a2c",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2025-10-08T12:30:45"
  },
  {
    "id": "2caa34a9-4d54-49b0-b95f-7b3e2b6f9f09",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "createdAt": "2025-10-07T09:15:12"
  }
]
```

### POST /api/user

📝 Description
Creates a new user account.
The password will be hashed automatically using BCrypt.

📥 Request Body
Content-Type: application/json

Request Example
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "password": "securePassword123"
}
```

✅ Response — 201 Created
Response Example
```json
{
  "id": "f81b7e56-8f52-4c6a-85de-8d14c92c14b9",
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "createdAt": "2025-10-08T12:45:00"
}
```

### GET /api/school-class

📝 Description
Fetches all school classes available in the system.

✅ Response — 200 OK
Returns a list of all school classes.

Response Example
```json
[
  {
    "id": "a73e95a4-3b10-4e58-8e54-7df14465c8d5",
    "schoolClassName": "3A Informatik"
  },
  {
    "id": "0c14b7d3-bd7b-4dc9-85f2-f15d43f98cd4",
    "schoolClassName": "4B Elektrotechnik"
  }
]
```

### POST /api/school-class

📝 Description
Creates a new school class.

📥 Request Body
Content-Type: application/json

Request Example
```json
{
  "name": "3A Softwareentwicklung"
}
```

✅ Response — 200 OK
Response Example
```json 
{
  "id": "b69df2aa-019f-44de-9865-89bc90228b5e",
  "schoolClassName": "3A Softwareentwicklung"
}
```

### POST /api/user/{userId}/connect/school-class/{schoolClassId}

📝 Description
Assigns a user to a school class.
If the user is already assigned, the request does nothing (idempotent behavior).

🧩 Path Variables

| Variable          | Type | Description                          |
| :---------------- | :--- | :----------------------------------- |
| userId            | UUID | The user’s unique ID<br>             |
| schoolClassId<br> | UUID | The class to connect the user to<br> |

✅ Response — 200 OK
Returns the updated user with all connected school classes.

Response Example
```json
{
  "id": "f3b7f3b8-12f1-4b79-b063-34597cd97c3f",
  "firstName": "Anna",
  "lastName": "Schmidt",
  "email": "anna.schmidt@example.com",
  "schoolClasses": [
    {
      "id": "b69df2aa-019f-44de-9865-89bc90228b5e",
      "schoolClassName": "3A Softwareentwicklung"
    }
  ]
}
```

### PUT /api/school-class/{schoolClassId}

📝 Description
Updates the name of an existing school class.


🧩 Path Variables

| Variable          | Type | Description                          |
| :---------------- | :--- | :----------------------------------- |
| schoolClassId<br> | UUID | ID of the school class to update<br> |

📥 Request Body
```json
{
  "name": "4A Medientechnik"
}
```

✅ Response — 200 OK
```json
{
  "id": "b69df2aa-019f-44de-9865-89bc90228b5e",
  "schoolClassName": "4A Medientechnik"
}
```

### DELETE /api/school-class/{schoolClassId}

📝 Description
Deletes a school class.
Before deletion, the class will automatically be removed from all users associated with it.

🧩 Path Variables

| Variable          | Type | Description                   |
| :---------------- | :--- | :---------------------------- |
| schoolClassId<br> | UUID | ID of the class to delete<br> |

✅ Response — 204 No Content
The class and all associations were removed successfully.

### GET /api/roles

📝 Description
Fetches all roles available in the system.

✅ Response — 200 OK
Returns a list of all existing roles.

Example Response
```json
[
  {
    "id": "3e6d9b32-5a74-42a3-9d18-4a921b6ab34f",
    "roleName": "Admin"
  },
  {
    "id": "9df2b2d1-cb6c-4d76-9482-24a2b59f12ef",
    "roleName": "Student"
  }
]
```

### POST /api/role

📝 Description
Creates a new role.

📥 Request Body
Content-Type: application/json

Example
```json
{
  "name": "Teacher"
}
```

✅ Response — 200 OK
Example
```json
{
  "id": "b69df2aa-019f-44de-9865-89bc90228b5e",
  "roleName": "Teacher"
}
```

### POST /api/user/{userId}/connect/role/{roleId}

📝 Description
Assigns a role to a user.
If the user already has this role, no duplicate will be added.

🧩 Path Variables

| Variable   | Type | Description                  |
| :--------- | :--- | :--------------------------- |
| userId     | UUID | ID of the user<br>           |
| roleId<br> | UUID | ID of the role to assign<br> |
✅ Response — 200 OK
Returns the updated user including all assigned roles.

Example
```json
{
  "id": "f3b7f3b8-12f1-4b79-b063-34597cd97c3f",
  "firstName": "Anna",
  "lastName": "Schmidt",
  "email": "anna.schmidt@example.com",
  "roles": [
    {
      "id": "b69df2aa-019f-44de-9865-89bc90228b5e",
      "roleName": "Teacher"
    },
    {
      "id": "3e6d9b32-5a74-42a3-9d18-4a921b6ab34f",
      "roleName": "Admin"
    }
  ]
}
```

### PUT /api/role/{roleId}

📝 Description
Updates the name of an existing role.

🧩 Path Variables

| Variable   | Type | Description                  |
| :--------- | :--- | :--------------------------- |
| roleId<br> | UUID | ID of the role to update<br> |
📥 Request Body

Example
```json
{
  "name": "Supervisor"
}
```

✅ Response — 200 OK

Example
```json
{
  "id": "b69df2aa-019f-44de-9865-89bc90228b5e",
  "roleName": "Supervisor"
}
```

### DELETE /api/role/{roleId}

📝 Description
Deletes a role from the system.
Before deletion, the role will automatically be removed from all users who currently have it.

🧩 Path Variables

| Variable   | Type | Description                  |
| :--------- | :--- | :--------------------------- |
| roleId<br> | UUID | ID of the role to delete<br> |

✅ Response — 204 No Content
The role and all associations were removed successfully.















----
# Endpoints

## Project Endpoints

### PUSH /api/project
📝 Description
Creates a new project.

📥 Request Body
Content-Type: application/json

Example
```json
{
  "projectName": "Einrichten eines IT-gestützten Arbeitsplatzes",
  "Deadline": "2025-02-14T10:23:45Z",
  "Groups": [],
}
```

✅ Response — 200 OK
Example
```json
{
  "message": "Project 'Einrichten eines IT-gestützten Arbeitsplatzes' wurde erstellt.",
  "result": "success"
}
```

### GET /api/project/{projectId}
📝 Description
get a project with project id.

✅ Response — 200 OK
Example
```json
{
  
}
```

### GET /api/projects
📝 Description
Get all projects


✅ Response — 200 OK
Example
```json
{
  
}
```

## Group Endpoints

### PUSH /api/group
📝 Description
Creates a new Group.

📥 Request Body
Content-Type: application/json

Example
```json
{
  "groupName": "P1G1",
  "members": []
}
```

✅ Response — 200 OK
Example
```json
{
    "message": "Group 'Group 1' wurde erstellt.",
  "result": "success"
}
```



### GET /api/group/{groupId}
📝 Description
get a group with group id.

✅ Response — 200 OK
Example
```json
{
  
}
```

### GET /api/groups
📝 Description
Get all groups


✅ Response — 200 OK
Example
```json
{
  
}
```