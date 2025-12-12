package de.assessify.app.assessifyapi.api.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "group_members")
public class GroupMember {
    
    @Id
    @UuidGenerator
    @Column(name = "id", nullable = false, unique = true)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable= false)
    private User member;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable=false)
    private Group group;

    @CreationTimestamp
    @Column(name = "joined_date", nullable= false , updatable= false)
    private LocalDateTime joinedDate;


    public GroupMember () {}
    public GroupMember (User member, Group group) {
        this.member = member;
        this.group = group;
    }

    public UUID getId (){
        return id;
    }

    public User getMember (){
        return member;
    }

    public void setMember (User user){
        this.member = user;
    }

    public Group getGroup(){
        return group;
    }

    public void setGroup(Group group){
        this.group = group;
    }

    public LocalDateTime getJoinedDate (){
        return joinedDate;
    }

}
