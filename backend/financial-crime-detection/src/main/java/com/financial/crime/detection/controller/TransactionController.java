package com.financial.crime.detection.controller;

import com.financial.crime.detection.dto.DashboardStats;
import com.financial.crime.detection.dto.TransactionRequest;
import com.financial.crime.detection.entity.Transaction;
import com.financial.crime.detection.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/status/{status}")
    public List<Transaction> getByStatus(@PathVariable String status) {
        return transactionService.getTransactionsByStatus(status);
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody TransactionRequest request) {
        return transactionService.createTransaction(request);
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return transactionService.getDashboardStats();
    }
}