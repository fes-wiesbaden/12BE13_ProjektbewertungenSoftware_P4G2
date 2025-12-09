package de.assessify.app.assessifyapi.api.service;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class CustomUserDetails extends User {
    private final Integer roleId;

    public CustomUserDetails(String username,
                             String password,
                             Collection<? extends GrantedAuthority> authorities,
                             Integer roleId) {
        super(username, password, authorities); // ruft den User-Konstruktor auf
        this.roleId = roleId;
    }

    public Integer getRoleId() {
        return roleId;
    }

}