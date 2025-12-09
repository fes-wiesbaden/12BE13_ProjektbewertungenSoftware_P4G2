package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.Noten;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotenRepository extends JpaRepository<Noten, UUID> {}