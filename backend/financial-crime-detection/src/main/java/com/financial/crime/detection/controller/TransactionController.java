package com.financial.crime.detection.controller;

import com.financial.crime.detection.entity.Transaction;
import com.financial.crime.detection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @PostMapping
    public Transaction save(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }
}