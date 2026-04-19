package com.financial.crime.detection.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double amount;
    private String location;
    private LocalDateTime timestamp;

    private String status; // NORMAL / SUSPICIOUS / FRAUD

    private String type; // TRANSFER, WITHDRAWAL, DEPOSIT, PAYMENT
    private String recipientAccount;
    private String description;
    private Double riskScore; // 0.0 - 1.0

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}