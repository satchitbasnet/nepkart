package com.nepkart.controller;

import com.nepkart.model.Customer;
import com.nepkart.repository.CustomerRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    private boolean isAdmin(HttpSession session) {
        Boolean admin = (Boolean) session.getAttribute("admin");
        return admin != null && admin;
    }
    
    @GetMapping
    public ResponseEntity<?> listCustomers(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        List<Customer> customers = customerRepository.findAll();
        List<Map<String, Object>> list = customers.stream()
            .filter(c -> c.getPasswordHash() != null) // Only registered customers
            .map(c -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", c.getId());
                m.put("firstName", c.getFirstName());
                m.put("lastName", c.getLastName());
                m.put("email", c.getEmail());
                m.put("isActive", c.isActive());
                m.put("createdAt", c.getCreatedAt());
                return m;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
    
    @PutMapping("/{id}/active")
    public ResponseEntity<Map<String, Object>> setActive(@PathVariable Long id, @RequestBody Map<String, Boolean> body, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        return customerRepository.findById(id)
            .map(c -> {
                if (c.getPasswordHash() == null) {
                    Map<String, Object> r = new HashMap<>();
                    r.put("success", false);
                    r.put("message", "Guest customer cannot be modified");
                    return ResponseEntity.badRequest().body(r);
                }
                c.setActive(body.getOrDefault("active", true));
                customerRepository.save(c);
                Map<String, Object> r = new HashMap<>();
                r.put("success", true);
                return ResponseEntity.ok(r);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
