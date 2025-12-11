package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.dtos.response.ImportResultDto;
import de.assessify.app.assessifyapi.api.entity.Role;
import de.assessify.app.assessifyapi.api.entity.SchoolClass;
import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.repository.RoleRepository;
import de.assessify.app.assessifyapi.api.repository.SchoolClassRepository;
import de.assessify.app.assessifyapi.api.repository.TrainingModuleRepository;
import de.assessify.app.assessifyapi.api.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ImportService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final TrainingModuleRepository trainingModuleRepository;

    public ImportService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            SchoolClassRepository schoolClassRepository,
            TrainingModuleRepository trainingModuleRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.trainingModuleRepository = trainingModuleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public ImportResultDto importUsersFromExcel(MultipartFile file) {
        ImportResultDto result = new ImportResultDto(0, 0, 0, new ArrayList<>());

        if (file == null || file.isEmpty()) {
            result.getErrors().add("Keine Datei hochgeladen.");
            return result;
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            if (sheet == null) {
                result.getErrors().add("Leeres Sheet in der Datei.");
                return result;
            }

            Map<String, Integer> headerIndex = readHeaderRow(sheet.getRow(0));
            if (headerIndex.isEmpty()) {
                result.getErrors().add("Konnte Header-Zeile nicht lesen.");
                return result;
            }

            int total = 0;
            int success = 0;
            List<String> errors = result.getErrors();

            for (int rowIdx = 1; rowIdx <= sheet.getLastRowNum(); rowIdx++) {
                Row row = sheet.getRow(rowIdx);
                if (row == null) {
                    continue;
                }
                total++;

                try {
                    String firstName = getCellString(row, headerIndex.get("first_name"));
                    String lastName = getCellString(row, headerIndex.get("last_name"));
                    String username = getCellString(row, headerIndex.get("username"));
                    String roleName = getCellString(row, headerIndex.get("role_name"));
                    String className = getCellString(row, headerIndex.get("class_name"));

                    if (username == null || username.isBlank()) {
                        errors.add("Zeile " + (rowIdx + 1) + ": username fehlt.");
                        continue;
                    }
                    Integer roleId = null;
                    if (roleName != null && !roleName.isBlank()) {
                        Optional<Role> roleOpt = roleRepository.findAll().stream()
                                .filter(r -> roleName.equalsIgnoreCase(r.getName()))
                                .findFirst();
                        if (roleOpt.isPresent()) {
                            roleId = roleOpt.get().getId();
                        } else {
                            errors.add("Zeile " + (rowIdx + 1) + ": Rolle '" + roleName + "' nicht gefunden.");
                            continue;
                        }
                    }

                    User user = new User();
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setUsername(username);
                    if (roleId != null) {
                        user.setRoleId(roleId);
                    }

                    String rawPassword = "meinPasswort1234";
                    user.setPassword(passwordEncoder.encode(rawPassword));

                    if (className != null && !className.isBlank()) {
                        SchoolClass schoolClass = schoolClassRepository.findAll().stream()
                                .filter(c -> className.equalsIgnoreCase(c.getClassName()))
                                .findFirst()
                                .orElseGet(() -> {
                                    SchoolClass sc = new SchoolClass();
                                    sc.setClassName(className);
                                    return schoolClassRepository.save(sc);
                                });

                        if (user.getSchoolClasses() == null) {
                            user.setSchoolClasses(new ArrayList<>());
                        }
                        user.getSchoolClasses().add(schoolClass);
                    }

                    userRepository.save(user);
                    success++;

                } catch (Exception ex) {
                    errors.add("Zeile " + (rowIdx + 1) + ": Fehler beim Import – " + ex.getMessage());
                }
            }

            result.setTotalRows(total);
            result.setSuccessCount(success);
            result.setErrorCount(total - success);
            return result;

        } catch (IOException e) {
            result.getErrors().add("Fehler beim Lesen der Datei: " + e.getMessage());
            return result;
        }
    }


    public ImportResultDto importClassesFromExcel(MultipartFile file) {
        ImportResultDto result = new ImportResultDto(0, 0, 0, new ArrayList<>());

        if (file == null || file.isEmpty()) {
            result.getErrors().add("Keine Datei hochgeladen.");
            return result;
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            if (sheet == null) {
                result.getErrors().add("Leeres Sheet in der Datei.");
                return result;
            }

            Map<String, Integer> headerIndex = readHeaderRow(sheet.getRow(0));
            if (headerIndex.isEmpty()) {
                result.getErrors().add("Konnte Header-Zeile nicht lesen.");
                return result;
            }

            int total = 0;
            int success = 0;
            List<String> errors = result.getErrors();

            for (int rowIdx = 1; rowIdx <= sheet.getLastRowNum(); rowIdx++) {
                Row row = sheet.getRow(rowIdx);
                if (row == null) {
                    continue;
                }
                total++;

                try {
                    String className = getCellString(row, headerIndex.get("class_name"));
                    String courseName = getCellString(row, headerIndex.get("course_name"));

                    if (className == null || className.isBlank()) {
                        errors.add("Zeile " + (rowIdx + 1) + ": class_name fehlt.");
                        continue;
                    }

                    SchoolClass schoolClass = new SchoolClass();
                    schoolClass.setClassName(className);
                    schoolClass.setCourseName(courseName);

                    schoolClassRepository.save(schoolClass);
                    success++;

                } catch (Exception ex) {
                    errors.add("Zeile " + (rowIdx + 1) + ": Fehler beim Import – " + ex.getMessage());
                }
            }

            result.setTotalRows(total);
            result.setSuccessCount(success);
            result.setErrorCount(total - success);
            return result;

        } catch (IOException e) {
            result.getErrors().add("Fehler beim Lesen der Datei: " + e.getMessage());
            return result;
        }
    }


    public ImportResultDto importTrainingModulesFromExcel(MultipartFile file) {
        ImportResultDto result = new ImportResultDto(0, 0, 0, new ArrayList<>());

        if (file == null || file.isEmpty()) {
            result.getErrors().add("Keine Datei hochgeladen.");
            return result;
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            if (sheet == null) {
                result.getErrors().add("Leeres Sheet in der Datei.");
                return result;
            }

            Map<String, Integer> headerIndex = readHeaderRow(sheet.getRow(0));
            if (headerIndex.isEmpty()) {
                result.getErrors().add("Konnte Header-Zeile nicht lesen.");
                return result;
            }

            int total = 0;
            int success = 0;
            List<String> errors = result.getErrors();

            for (int rowIdx = 1; rowIdx <= sheet.getLastRowNum(); rowIdx++) {
                Row row = sheet.getRow(rowIdx);
                if (row == null) {
                    continue;
                }
                total++;

                try {
                    String name = getCellString(row, headerIndex.get("training_module_name"));
                    String weightingStr = getCellString(row, headerIndex.get("training_module_weighting"));

                    if (name == null || name.isBlank()) {
                        errors.add("Zeile " + (rowIdx + 1) + ": training_module_name fehlt.");
                        continue;
                    }

                    float weighting = 0.0f;
                    if (weightingStr != null && !weightingStr.isBlank()) {
                        try {
                            weighting = Float.parseFloat(weightingStr);
                        } catch (NumberFormatException nfe) {
                            errors.add("Zeile " + (rowIdx + 1) + ": Ungültige Gewichtung '" + weightingStr + "'. Setze 0.0.");
                        }
                    }

                    TrainingModule module = new TrainingModule();
                    module.setName(name);
                    module.setWeighting(weighting);

                    module.setDescription(name);

                    trainingModuleRepository.save(module);
                    success++;

                } catch (Exception ex) {
                    errors.add("Zeile " + (rowIdx + 1) + ": Fehler beim Import – " + ex.getMessage());
                }
            }

            result.setTotalRows(total);
            result.setSuccessCount(success);
            result.setErrorCount(total - success);
            return result;

        } catch (IOException e) {
            result.getErrors().add("Fehler beim Lesen der Datei: " + e.getMessage());
            return result;
        }
    }


    private Map<String, Integer> readHeaderRow(Row headerRow) {
        Map<String, Integer> map = new HashMap<>();
        if (headerRow == null) {
            return map;
        }

        for (int i = 0; i < headerRow.getLastCellNum(); i++) {
            Cell cell = headerRow.getCell(i);
            if (cell == null) {
                continue;
            }
            String val = cell.getStringCellValue();
            if (val != null && !val.isBlank()) {
                map.put(val.trim().toLowerCase(Locale.ROOT), i);
            }
        }

        return map;
    }

    private String getCellString(Row row, Integer cellIndex) {
        if (cellIndex == null) {
            return null;
        }
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return null;
        }

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> null;
        };
    }
}
