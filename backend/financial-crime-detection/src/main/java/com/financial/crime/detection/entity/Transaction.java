package com.financial.crime.detection.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double amount;
    private String location;
    private LocalDateTime timestamp;

    private String status; // NORMAL / FRAUD

    // Getters and Setters
}