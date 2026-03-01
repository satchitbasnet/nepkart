package com.nepkart.service;

import com.nepkart.dto.CustomerRegisterDTO;
import com.nepkart.dto.ResetPasswordDTO;
import com.nepkart.model.Customer;
import com.nepkart.model.PasswordResetToken;
import com.nepkart.repository.CustomerRepository;
import com.nepkart.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class CustomerAuthService {
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$"
    );
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Optional<Customer> register(CustomerRegisterDTO dto) {
        if (customerRepository.findByEmail(dto.getEmail().trim().toLowerCase()).isPresent()) {
            return Optional.empty();
        }
        if (!isValidPassword(dto.getPassword())) {
            throw new IllegalArgumentException("Password must be 8+ characters with uppercase, lowercase, numbers, and symbols");
        }
        Customer customer = new Customer(
            dto.getFirstName().trim(),
            dto.getLastName().trim(),
            dto.getEmail().trim().toLowerCase(),
            passwordEncoder.encode(dto.getPassword())
        );
        return Optional.of(customerRepository.save(customer));
    }
    
    public Optional<Customer> authenticate(String email, String password) {
        Optional<Customer> opt = customerRepository.findByEmail(email.trim().toLowerCase());
        if (opt.isEmpty()) return Optional.empty();
        Customer c = opt.get();
        if (!c.isActive()) return Optional.empty();
        if (c.getPasswordHash() == null) return Optional.empty();
        if (!passwordEncoder.matches(password, c.getPasswordHash())) return Optional.empty();
        return Optional.of(c);
    }
    
    public boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
    
    @Transactional
    public String requestPasswordReset(String email) {
        Optional<Customer> opt = customerRepository.findByEmail(email.trim().toLowerCase());
        if (opt.isEmpty()) return null;
        Customer customer = opt.get();
        if (customer.getPasswordHash() == null) return null; // guest account, no password
        
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(
            new SecureRandom().generateSeed(32)
        );
        PasswordResetToken prt = new PasswordResetToken(customer, token, LocalDateTime.now().plusHours(1));
        tokenRepository.save(prt);
        return token;
    }
    
    @Transactional
    public boolean resetPassword(ResetPasswordDTO dto) {
        Optional<Customer> opt = customerRepository.findByEmail(dto.getEmail().trim().toLowerCase());
        if (opt.isEmpty()) return false;
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(dto.getToken().trim());
        if (tokenOpt.isEmpty()) return false;
        PasswordResetToken prt = tokenOpt.get();
        if (prt.isExpired()) return false;
        if (!prt.getCustomer().getId().equals(opt.get().getId())) return false;
        if (!isValidPassword(dto.getNewPassword())) return false;
        
        Customer c = prt.getCustomer();
        c.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        customerRepository.save(c);
        prt.setUsed(true);
        tokenRepository.save(prt);
        return true;
    }
}
