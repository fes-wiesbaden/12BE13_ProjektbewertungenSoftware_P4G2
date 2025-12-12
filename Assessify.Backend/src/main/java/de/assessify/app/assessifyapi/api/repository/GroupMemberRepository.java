package de.assessify.app.assessifyapi.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import de.assessify.app.assessifyapi.api.entity.GroupMember;

public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    // Find all members of a group
    List<GroupMember> findByGroupId(UUID groupId);
    
    // Find all groups a user is member of
    List<GroupMember> findByMemberId(UUID memberId);
    
    // Check if user is already in group
    boolean existsByMemberIdAndGroupId(UUID memberId, UUID groupId);
    
    // Find specific membership
    Optional<GroupMember> findByMemberIdAndGroupId(UUID memberId, UUID groupId);
    
    // Delete membership
    void deleteByMemberIdAndGroupId(UUID memberId, UUID groupId);
    
    // Count members in a group
    long countByGroupId(UUID groupId);
    
    // Find with details
    @Query("SELECT gm FROM GroupMember gm " +
           "JOIN FETCH gm.member " +
           "WHERE gm.group.id = :groupId")
    List<GroupMember> findMembersByGroupIdWithDetails(@Param("groupId") UUID groupId);
    
    @Query("SELECT gm FROM GroupMember gm " +
           "JOIN FETCH gm.group " +
           "WHERE gm.member.id = :memberId")
    List<GroupMember> findGroupsByMemberIdWithDetails(@Param("memberId") UUID memberId);

}
