package de.assessify.app.assessifyapi.api.service;

import de.assessify.app.assessifyapi.api.entity.TrainingModule;
import de.assessify.app.assessifyapi.api.entity.User;
import de.assessify.app.assessifyapi.api.entity.Grade;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeCalculationService {

//    public double calculateModuleGrade(TrainingModule module) {
//        List<Grade> grades = module.getGrades();
//        if (grades == null || grades.isEmpty()) {
//            return 0.0;
//        }
//
//        double sumWeighted = 0.0;
//        double sumWeights = 0.0;
//
//        for (Grade g : grades) {
//            double value = g.getValue();
//            double weight = g.getGradeWeighting();
//
//            sumWeighted += value * weight;
//            sumWeights  += weight;
//        }
//
//        if (sumWeights == 0.0) {
//            return 0.0;
//        }
//
//        return sumWeighted / sumWeights;
//    }
//
//    public double calculateUserOverallGrade(User user) {
//        var modules = user.getTrainingModules();
//        if (modules == null || modules.isEmpty()) {
//            return 0.0;
//        }
//
//        double sumWeighted = 0.0;
//        double sumWeights = 0.0;
//
//        for (TrainingModule module : modules) {
//            double moduleAverage = calculateModuleGrade(module);
//            double moduleWeight = module.getWeighting();
//
//            sumWeighted += moduleAverage * moduleWeight;
//            sumWeights  += moduleWeight;
//        }
//
//        if (sumWeights == 0.0) {
//            return 0.0;
//        }
//
//        return sumWeighted / sumWeights;
//    }
}