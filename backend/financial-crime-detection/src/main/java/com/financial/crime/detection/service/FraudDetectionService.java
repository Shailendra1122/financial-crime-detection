package com.financial.crime.detection.service;

import com.financial.crime.detection.entity.Alert;
import com.financial.crime.detection.entity.Transaction;
import com.financial.crime.detection.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FraudDetectionService {

    private static final double HIGH_AMOUNT_THRESHOLD = 10000.0;
    private static final double SUSPICIOUS_AMOUNT_THRESHOLD = 5000.0;
    private static final List<String> HIGH_RISK_LOCATIONS = List.of(
        "FOREIGN", "OFFSHORE", "UNKNOWN", "UNVERIFIED"
    );

    @Autowired
    private AlertRepository alertRepository;

    /**
     * Analyze a transaction for potential fraud using rule-based detection.
     * Returns the transaction with updated status and risk score.
     */
    public Transaction analyzeTransaction(Transaction transaction) {
        List<String> reasons = new ArrayList<>();
        double riskScore = 0.0;

        // Rule 1: Very high amount
        if (transaction.getAmount() != null && transaction.getAmount() > HIGH_AMOUNT_THRESHOLD) {
            riskScore += 0.4;
            reasons.add("Transaction amount ($" + transaction.getAmount() + ") exceeds $" + HIGH_AMOUNT_THRESHOLD);
        }
        // Rule 1b: Moderately high amount
        else if (transaction.getAmount() != null && transaction.getAmount() > SUSPICIOUS_AMOUNT_THRESHOLD) {
            riskScore += 0.2;
            reasons.add("Transaction amount ($" + transaction.getAmount() + ") exceeds $" + SUSPICIOUS_AMOUNT_THRESHOLD);
        }

        // Rule 2: High-risk location
        if (transaction.getLocation() != null &&
            HIGH_RISK_LOCATIONS.contains(transaction.getLocation().toUpperCase())) {
            riskScore += 0.3;
            reasons.add("Transaction from high-risk location: " + transaction.getLocation());
        }

        // Rule 3: Large round amounts (common in money laundering)
        if (transaction.getAmount() != null && transaction.getAmount() >= 1000 &&
            transaction.getAmount() % 1000 == 0) {
            riskScore += 0.1;
            reasons.add("Suspicious round amount detected: $" + transaction.getAmount());
        }

        // Rule 4: Transfer type with high amount
        if ("TRANSFER".equalsIgnoreCase(transaction.getType()) &&
            transaction.getAmount() != null && transaction.getAmount() > SUSPICIOUS_AMOUNT_THRESHOLD) {
            riskScore += 0.2;
            reasons.add("High-value transfer detected");
        }

        // Rule 5: Withdrawal with very high amount
        if ("WITHDRAWAL".equalsIgnoreCase(transaction.getType()) &&
            transaction.getAmount() != null && transaction.getAmount() > HIGH_AMOUNT_THRESHOLD) {
            riskScore += 0.2;
            reasons.add("Large cash withdrawal detected");
        }

        // Cap risk score at 1.0
        riskScore = Math.min(riskScore, 1.0);
        transaction.setRiskScore(riskScore);

        // Classify based on risk score
        if (riskScore >= 0.7) {
            transaction.setStatus("FRAUD");
            createAlert(transaction, reasons, "CRITICAL");
        } else if (riskScore >= 0.4) {
            transaction.setStatus("SUSPICIOUS");
            createAlert(transaction, reasons, "HIGH");
        } else if (riskScore >= 0.2) {
            transaction.setStatus("SUSPICIOUS");
            createAlert(transaction, reasons, "MEDIUM");
        } else {
            transaction.setStatus("NORMAL");
        }

        return transaction;
    }

    private void createAlert(Transaction transaction, List<String> reasons, String severity) {
        Alert alert = new Alert();
        alert.setTransactionId(transaction.getId());
        alert.setMessage(String.join("; ", reasons));
        alert.setSeverity(severity);
        alert.setTimestamp(LocalDateTime.now());
        alert.setResolved(false);
        alertRepository.save(alert);
    }
}
