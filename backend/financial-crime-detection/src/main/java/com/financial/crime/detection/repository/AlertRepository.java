package com.financial.crime.detection.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.financial.crime.detection.entity.Alert;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByResolved(boolean resolved);

    List<Alert> findByTransactionId(Long transactionId);

    long countByResolved(boolean resolved);

    List<Alert> findAllByOrderByTimestampDesc();
}
