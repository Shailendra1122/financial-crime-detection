package com.financial.crime.detection.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalTransactions;
    private long fraudulentTransactions;
    private long suspiciousTransactions;
    private long normalTransactions;
    private double totalAmount;
    private double fraudAmount;
    private long activeAlerts;
    private long resolvedAlerts;
}
