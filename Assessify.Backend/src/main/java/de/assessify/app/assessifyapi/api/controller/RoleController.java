//package de.assessify.app.assessifyapi.api.controller.role;
//
//import de.assessify.app.assessifyapi.api.dtos.request.AddRoleDto;
//import de.assessify.app.assessifyapi.api.dtos.request.UpdateRoleDto;
//import de.assessify.app.assessifyapi.api.dtos.response.RoleDto;
//import de.assessify.app.assessifyapi.api.dtos.response.UserWithRolesDto;
//import de.assessify.app.assessifyapi.api.service.EntityFinderService;
//import de.assessify.app.assessifyapi.api.repository.RoleRepository;
//import de.assessify.app.assessifyapi.api.repository.UserRepository;
//import de.assessify.app.assessifyapi.api.entity.Role;
//import de.assessify.app.assessifyapi.api.entity.User;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api")
//public class RoleController {
//    private final RoleRepository roleRepository;
//    private final UserRepository userRepository;
//    private final EntityFinderService entityFinderService;
//
//    public RoleController(RoleRepository roleRepository, UserRepository userRepository, EntityFinderService entityFinderService) {
//        this.roleRepository = roleRepository;
//        this.userRepository = userRepository;
//        this.entityFinderService = entityFinderService;
//    }
//
//    @GetMapping("/roles")
//    public ResponseEntity<List<RoleDto>> getAllRoles() {
//        var modules = roleRepository.findAll()
//                .stream()
//                .map(field -> new RoleDto(
//                        field.getId(),
//                        field.getRoleName()
//                ))
//                .toList();
//
//        return ResponseEntity.ok(modules);
//    }
//
//    @PostMapping("/role")
//    public ResponseEntity<RoleDto> addRole(@RequestBody AddRoleDto dto) {
//
//        Role entity = new Role();
//        entity.setRoleName(dto.name());
//
//        Role saved = roleRepository.save(entity);
//
//        RoleDto response = new RoleDto(
//                saved.getId(),
//                saved.getRoleName()
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/user/{userId}/connect/role/{roleId}")
//    public ResponseEntity<UserWithRolesDto> addRoleToUser(
//            @PathVariable UUID userId,
//            @PathVariable int roleId){
//
//        User user = entityFinderService.findUser(userId);
//        Role role = entityFinderService.findRole(roleId);
//
//        if (!user.getRoles().contains(role)) {
//            user.getRoles().add(role);
//        }
//
//        User updatedUser = userRepository.save(user);
//
//        UserWithRolesDto response = new UserWithRolesDto(
//                updatedUser.getId(),
//                updatedUser.getFirstName(),
//                updatedUser.getFirstName(),
//                updatedUser.getEmail(),
//                updatedUser.getRoles().stream()
//                        .map(r -> new RoleDto(r.getId(), r.getRoleName()))
//                        .toList()
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PutMapping("/role/{roleId}")
//    public ResponseEntity<RoleDto> updateRole(
//            @PathVariable int roleId,
//            @RequestBody UpdateRoleDto dto) {
//
//        Role role = entityFinderService.findRole(roleId);
//
//        role.setRoleName(dto.name());
//
//        Role updated = roleRepository.save(role);
//
//        RoleDto response = new RoleDto(
//                updated.getId(),
//                updated.getRoleName()
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @DeleteMapping("/role/{roleId}")
//    public ResponseEntity<Void> deleteRole(
//            @PathVariable int roleId) {
//
//        Role role = entityFinderService.findRole(roleId);
//
//        List<User> userWithRole = userRepository.findAll().stream()
//                .filter(p -> p.getRoles().contains(role))
//                .toList();
//
//        for (User user : userWithRole) {
//            user.getRoles().remove(role);
//            userRepository.save(user);
//        }
//
//        roleRepository.delete(role);
//        return ResponseEntity.noContent().build();
//    }
//}