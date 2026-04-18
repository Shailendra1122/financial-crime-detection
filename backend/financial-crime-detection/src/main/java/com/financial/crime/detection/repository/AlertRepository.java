package com.financial.crime.detection.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.financial.crime.detection.entity.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    
}
