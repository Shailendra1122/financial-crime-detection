package com.financial.crime.detection.service;

import com.financial.crime.detection.dto.DashboardStats;
import com.financial.crime.detection.dto.TransactionRequest;
import com.financial.crime.detection.entity.Transaction;
import com.financial.crime.detection.repository.AlertRepository;
import com.financial.crime.detection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private FraudDetectionService fraudDetectionService;

    public Transaction createTransaction(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setAmount(request.getAmount());
        transaction.setLocation(request.getLocation());
        transaction.setType(request.getType() != null ? request.getType() : "PAYMENT");
        transaction.setRecipientAccount(request.getRecipientAccount());
        transaction.setDescription(request.getDescription());

        // Save first to get the ID
        transaction = transactionRepository.save(transaction);

        // Run fraud analysis
        transaction = fraudDetectionService.analyzeTransaction(transaction);

        // Save again with updated status and risk score
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTimestampDesc();
    }

    public List<Transaction> getTransactionsByStatus(String status) {
        return transactionRepository.findByStatus(status);
    }

    public DashboardStats getDashboardStats() {
        long total = transactionRepository.count();
        long fraud = transactionRepository.countByStatus("FRAUD");
        long suspicious = transactionRepository.countByStatus("SUSPICIOUS");
        long normal = transactionRepository.countByStatus("NORMAL");
        double totalAmount = transactionRepository.sumAllAmounts();
        double fraudAmount = transactionRepository.sumAmountByStatus("FRAUD");
        long activeAlerts = alertRepository.countByResolved(false);
        long resolvedAlerts = alertRepository.countByResolved(true);

        return new DashboardStats(total, fraud, suspicious, normal,
                totalAmount, fraudAmount, activeAlerts, resolvedAlerts);
    }
}
