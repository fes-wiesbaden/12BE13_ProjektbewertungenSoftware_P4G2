package de.assessify.app.assessifyapi.api.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "group_members",
    uniqueConstraints = {
        @UniqueConstraint(columnNames= {"group_id", "member_id"})
    })
@Data
@Builder
public class GroupMember {

    @Id
@UuidGenerator
private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @CreationTimestamp
    @Column(name = "joined_date", nullable = false, updatable = false)
    private LocalDateTime joinedDate;
}
