package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import io.micrometer.common.lang.Nullable;

@Entity
@Table(name = "role")
@Data
public class Role {

    @Id
    @Column(name = "role_id", nullable=false, unique=true)
    private Integer id;

    @Column(name = "role_name", nullable=false, length = 50)
    private String roleName;


    // Navigation property
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<User> users = new HashSet<>();
}