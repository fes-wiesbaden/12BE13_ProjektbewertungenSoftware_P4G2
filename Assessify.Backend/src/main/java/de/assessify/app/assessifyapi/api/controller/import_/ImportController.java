package de.assessify.app.assessifyapi.api.controller.import_;

import de.assessify.app.assessifyapi.api.dtos.response.ImportResultDto;
import de.assessify.app.assessifyapi.api.service.ImportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final ImportService importService;

    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping("/users")
    public ResponseEntity<ImportResultDto> importUsers(@RequestParam("file") MultipartFile file) {
        ImportResultDto result = importService.importUsersFromExcel(file);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping("/classes")
    public ResponseEntity<ImportResultDto> importClasses(@RequestParam("file") MultipartFile file) {
        ImportResultDto result = importService.importClassesFromExcel(file);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping("/training-modules")
    public ResponseEntity<ImportResultDto> importTrainingModules(@RequestParam("file") MultipartFile file) {
        ImportResultDto result = importService.importTrainingModulesFromExcel(file);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
