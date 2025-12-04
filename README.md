# Assessify

# 🧾 Project Description
Project Evaluation and Management System

This system provides a digital platform for managing and evaluating student performance.
Teachers can view, edit, and calculate student grades, while students can access their own grades and evaluate other students’ projects.

The goal of this project is to simplify the grading process, enhance transparency, and encourage peer evaluation in academic environments.
It combines administrative efficiency for teachers with interactive functionality for students.

## 📚 Table of Contents
- [About the Project](#about-the-project)
- [API](#api)

# 🧾 About the Project


# API
For detailed information about API endpoints, request/response format, see [API Documentation](API.md).

## Frameworks:

|num|name|Language|framework|
|-|-|-|-|
|1|Server|Java| |
|2|Client|Typescript|Angular|
|3|Database|sql|postgres|
|4|Styling|CSS|TailwindCSS|




## Rest API Framework Auswahl
- [x] [Spring Boot](https://medium.com/@ronaka2328/choosing-the-right-java-framework-for-rest-apis-a-comprehensive-guide-0816f2bfc89a)
    - Is Muture
    - Has more Docu
    
- [ ] Quarkus
- [ ] Vert.x



# App Components:

## Users:

    - Admin
    - Teacher
    - Student

# Database structure:

## Tables:

### User
    - uuid
    - fullName
    - username
    - password
    - role
    - school
    - class_id (classes)
    - Note_ID (Noten)

### Noten
    - Note_ID
    - LF_ID (Lerneflede)

### Noten_Entries
    - NE_ID
    - Note
    - Note_ID (Noten)

### Lerneflede
    - LF_ID
    - LF_Number

### classes
    - class_id
    - class_name










