package com.inventorypulse.inventorypulse_backend.auth.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class MeController {

    @GetMapping("/me")
    public String me(@AuthenticationPrincipal UserDetails user) {
        return "Hello, " + user.getUsername();
    }
}
