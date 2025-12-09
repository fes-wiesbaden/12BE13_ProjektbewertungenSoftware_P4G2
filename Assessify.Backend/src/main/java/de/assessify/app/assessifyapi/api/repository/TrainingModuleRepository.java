package de.assessify.app.assessifyapi.api.repository;

import de.assessify.app.assessifyapi.api.entity.Lernfeld;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TrainingModuleRepository extends JpaRepository<Lernfeld, UUID> {}