package com.financial.crime.detection.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long transactionId;
    private String message;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private LocalDateTime timestamp;
    private boolean resolved;
}
