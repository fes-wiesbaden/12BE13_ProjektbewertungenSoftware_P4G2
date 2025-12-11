package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.entity.SchoolClass;
import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.entity.Role;
import de.assessify.app.assessifyapi.api.repository.SchoolClassRepository;
import de.assessify.app.assessifyapi.api.repository.TrainingModuleRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ExportService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final TrainingModuleRepository trainingModuleRepository;

    public ExportService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            SchoolClassRepository schoolClassRepository,
            TrainingModuleRepository trainingModuleRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.trainingModuleRepository = trainingModuleRepository;
    }

    public byte[] exportUsersToExcel(Integer roleId, UUID classId) {
        List<User> users;

        if (roleId != null && classId != null) {

            users = userRepository.findByClassIdAndRoleId(classId, roleId);
        } else if (roleId != null) {
            users = userRepository.findByRoleId(roleId);
        } else if (classId != null) {

            users = userRepository.findAll().stream()
                    .filter(u -> u.getSchoolClasses() != null &&
                            u.getSchoolClasses().stream().anyMatch(c -> c.getId().equals(classId)))
                    .toList();
        } else {
            users = userRepository.findAll();
        }

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Users");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("first_name");
            header.createCell(1).setCellValue("last_name");
            header.createCell(2).setCellValue("class_name");
            header.createCell(3).setCellValue("role_name");
            header.createCell(4).setCellValue("username");

            int rowIdx = 1;

            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);

                String roleName = "";
                Integer roleIdValue = user.getRoleId(); 
                if (roleIdValue != null) {
                    Role role = roleRepository.findById(roleIdValue).orElse(null);
                    if (role != null) {
                        roleName = nullSafe(role.getName());
                    }
                }

                String className = "";
                if (user.getSchoolClasses() != null && !user.getSchoolClasses().isEmpty()) {
                    className = user.getSchoolClasses()
                            .stream()
                            .findFirst()
                            .map(SchoolClass::getClassName)
                            .orElse("");
                }

                row.createCell(0).setCellValue(nullSafe(user.getFirstName()));
                row.createCell(1).setCellValue(nullSafe(user.getLastName()));
                row.createCell(2).setCellValue(className);
                row.createCell(3).setCellValue(roleName);
                row.createCell(4).setCellValue(nullSafe(user.getUsername()));
            }

            autosizeColumns(sheet, 5);
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Erstellen der User-Export-Datei", e);
        }
    }

    public byte[] exportTrainingModulesToExcel() {
        List<TrainingModule> modules = trainingModuleRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Training Modules");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("training_module_id");
            header.createCell(1).setCellValue("training_module_name");
            header.createCell(2).setCellValue("training_module_weighting");

            int rowIdx = 1;

            for (TrainingModule module : modules) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(
                        module.getId() != null ? module.getId().toString() : ""
                );
                row.createCell(1).setCellValue(nullSafe(module.getName()));
                row.createCell(2).setCellValue(module.getWeighting());
            }

            autosizeColumns(sheet, 3);
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Erstellen der Training-Module-Export-Datei", e);
        }
    }


     public byte[] exportRolesToExcel() {
        List<Role> roles = roleRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Roles");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("role_id");
            header.createCell(1).setCellValue("role_name");

            int rowIdx = 1;

            for (Role role : roles) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(
                        role.getId() != null ? role.getId().toString() : ""
                );
                row.createCell(1).setCellValue(nullSafe(role.getName()));
            }

            autosizeColumns(sheet, 2);
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Erstellen der Rollen-Export-Datei", e);
        }
    }
    public byte[] exportClassesToExcel() {
        List<SchoolClass> classes = schoolClassRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Classes");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("class_id");
            header.createCell(1).setCellValue("class_name");
            header.createCell(2).setCellValue("course_name");

            int rowIdx = 1;

            for (SchoolClass schoolClass : classes) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(
                        schoolClass.getId() != null ? schoolClass.getId().toString() : ""
                );
                row.createCell(1).setCellValue(nullSafe(schoolClass.getClassName()));
                row.createCell(2).setCellValue(nullSafe(schoolClass.getCourseName()));
            }

            autosizeColumns(sheet, 3);
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Erstellen der Klassen-Export-Datei", e);
        }
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }

    private void autosizeColumns(Sheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
