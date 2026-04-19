package com.financial.crime.detection.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.financial.crime.detection.entity.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByStatus(String status);

    List<Transaction> findByUserId(Long userId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = ?1")
    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t")
    double sumAllAmounts();

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = ?1")
    double sumAmountByStatus(String status);

    List<Transaction> findAllByOrderByTimestampDesc();
}
