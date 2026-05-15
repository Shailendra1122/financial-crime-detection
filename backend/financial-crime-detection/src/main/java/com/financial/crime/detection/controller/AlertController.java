package com.financial.crime.detection.controller;

import com.financial.crime.detection.entity.Alert;
import com.financial.crime.detection.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping
    public List<Alert> getAlerts() {
        return alertRepository.findAllByOrderByTimestampDesc();
    }

    @GetMapping("/active")
    public List<Alert> getActiveAlerts() {
        return alertRepository.findByResolved(false);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable Long id) {
        Optional<Alert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isPresent()) {
            Alert alert = alertOpt.get();
            alert.setResolved(true);
            return ResponseEntity.ok(alertRepository.save(alert));
        }
        return ResponseEntity.notFound().build();
    }
}