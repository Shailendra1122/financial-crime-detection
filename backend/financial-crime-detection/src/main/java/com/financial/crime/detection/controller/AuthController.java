package com.financial.crime.detection.controller;

import com.financial.crime.detection.entity.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // temporary login (no validation yet)
        return "dummy-token";
    }
}