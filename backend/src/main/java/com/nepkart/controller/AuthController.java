package com.nepkart.controller;

import com.nepkart.dto.CustomerLoginDTO;
import com.nepkart.dto.CustomerRegisterDTO;
import com.nepkart.dto.LoginRequestDTO;
import com.nepkart.dto.ResetPasswordDTO;
import com.nepkart.model.Customer;
import com.nepkart.service.AuthService;
import com.nepkart.service.CustomerAuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private CustomerAuthService customerAuthService;
    
    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@Valid @RequestBody LoginRequestDTO loginRequest,
                                                          HttpSession session) {
        if (authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword())) {
            session.setAttribute("admin", true);
            session.setAttribute("username", loginRequest.getUsername());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @PostMapping("/customer/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody CustomerRegisterDTO dto) {
        try {
            Optional<Customer> customer = customerAuthService.register(dto);
            if (customer.isEmpty()) {
                Map<String, Object> r = new HashMap<>();
                r.put("success", false);
                r.put("message", "Email already registered");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(r);
            }
            Map<String, Object> r = new HashMap<>();
            r.put("success", true);
            r.put("message", "Account created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(r);
        } catch (IllegalArgumentException e) {
            Map<String, Object> r = new HashMap<>();
            r.put("success", false);
            r.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(r);
        }
    }
    
    @PostMapping("/customer/login")
    public ResponseEntity<Map<String, Object>> customerLogin(@Valid @RequestBody CustomerLoginDTO dto,
                                                             HttpSession session) {
        Optional<Customer> customer = customerAuthService.authenticate(dto.getEmail(), dto.getPassword());
        if (customer.isPresent()) {
            Customer c = customer.get();
            session.setAttribute("customerId", c.getId());
            session.setAttribute("customerEmail", c.getEmail());
            session.setAttribute("customerName", c.getFirstName() + " " + c.getLastName());
            Map<String, Object> r = new HashMap<>();
            r.put("success", true);
            r.put("message", "Login successful");
            r.put("customer", Map.of(
                "id", c.getId(),
                "email", c.getEmail(),
                "firstName", c.getFirstName(),
                "lastName", c.getLastName()
            ));
            return ResponseEntity.ok(r);
        } else {
            Map<String, Object> r = new HashMap<>();
            r.put("success", false);
            r.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
        }
    }
    
    @PostMapping("/customer/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            Map<String, Object> r = new HashMap<>();
            r.put("success", false);
            r.put("message", "Email is required");
            return ResponseEntity.badRequest().body(r);
        }
        String token = customerAuthService.requestPasswordReset(email);
        Map<String, Object> r = new HashMap<>();
        if (token != null) {
            r.put("success", true);
            r.put("message", "Reset token generated. Use it to reset your password.");
            r.put("token", token); // In production, send via email instead
        } else {
            r.put("success", false);
            r.put("message", "No account found with this email or account cannot be reset");
        }
        return ResponseEntity.ok(r);
    }
    
    @PostMapping("/customer/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordDTO dto) {
        boolean ok = customerAuthService.resetPassword(dto);
        Map<String, Object> r = new HashMap<>();
        if (ok) {
            r.put("success", true);
            r.put("message", "Password reset successfully");
            return ResponseEntity.ok(r);
        } else {
            r.put("success", false);
            r.put("message", "Invalid or expired token");
            return ResponseEntity.badRequest().body(r);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAuth(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Boolean isAdmin = (Boolean) session.getAttribute("admin");
        if (isAdmin != null && isAdmin) {
            response.put("authenticated", true);
            response.put("userType", "admin");
            response.put("username", session.getAttribute("username"));
        } else {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId != null) {
                response.put("authenticated", true);
                response.put("userType", "customer");
                response.put("customerId", customerId);
                response.put("customerEmail", session.getAttribute("customerEmail"));
                response.put("customerName", session.getAttribute("customerName"));
            } else {
                response.put("authenticated", false);
            }
        }
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Auth service is running");
        return ResponseEntity.ok(response);
    }
}
