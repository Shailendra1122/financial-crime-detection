package com.financial.crime.detection.controller;

import com.financial.crime.detection.entity.Alert;
import com.financial.crime.detection.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@CrossOrigin
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping
    public List<Alert> getAlerts() {
        return alertRepository.findAll();
    }
}