package com.financial.crime.detection.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @PostMapping("/transactions")
    public String save(@RequestBody String data) {
        System.out.println(data);
        return "Transaction saved successfully";
    }
}