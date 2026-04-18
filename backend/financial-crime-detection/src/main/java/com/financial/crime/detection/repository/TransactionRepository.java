package com.financial.crime.detection.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.financial.crime.detection.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
}
