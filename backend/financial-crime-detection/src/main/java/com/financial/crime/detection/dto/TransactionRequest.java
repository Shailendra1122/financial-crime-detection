package com.financial.crime.detection.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private Long userId;
    private Double amount;
    private String location;
    private String type; // TRANSFER, WITHDRAWAL, DEPOSIT, PAYMENT
    private String recipientAccount;
    private String description;
}
