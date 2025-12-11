package de.assessify.app.assessifyapi.api.controller;

import de.assessify.app.assessifyapi.api.service.ExportService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/export")
public class ExportController {
    
    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/users")
    public ResponseEntity<byte[]> exportUsers(
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) UUID classId
    ) {
        byte[] excelFile = exportService.exportUsersToExcel(roleId, classId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ));

        String filename = "users_export.xlsx";
        headers.setContentDisposition(
                ContentDisposition.attachment().filename(filename).build()
        );

        return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
    }

    @GetMapping("/training-modules")
    public ResponseEntity<byte[]> exportTrainingModules() {
        byte[] excelFile = exportService.exportTrainingModulesToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ));

        String filename = "training_modules_export.xlsx";
        headers.setContentDisposition(
                ContentDisposition.attachment().filename(filename).build()
        );

        return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
    }

    @GetMapping("/classes")
    public ResponseEntity<byte[]> exportClasses() {
        byte[] excelFile = exportService.exportClassesToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ));

        String filename = "classes_export.xlsx";
        headers.setContentDisposition(
                ContentDisposition.attachment().filename(filename).build()
        );

        return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
    }
    @GetMapping("/roles")
    public ResponseEntity<byte[]> exportRoles() {
        byte[] excelFile = exportService.exportRolesToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ));
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("roles_export.xlsx").build()
        );

        return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
    }
}

