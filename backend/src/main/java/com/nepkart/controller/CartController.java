package com.nepkart.controller;

import com.nepkart.model.CartItem;
import com.nepkart.model.Product;
import com.nepkart.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            Map<String, Object> r = new HashMap<>();
            r.put("items", List.of());
            return ResponseEntity.ok(r);
        }
        List<CartItem> items = cartService.getCart(customerId);
        List<Map<String, Object>> itemList = items.stream().map(item -> {
            Product p = item.getProduct();
            Map<String, Object> m = new HashMap<>();
            m.put("productId", p.getId());
            m.put("quantity", item.getQuantity());
            m.put("product", Map.of(
                "id", p.getId(),
                "name", p.getName(),
                "price", p.getPrice(),
                "imageUrl", p.getImageUrl() != null ? p.getImageUrl() : "",
                "stock", p.getStock()
            ));
            return m;
        }).collect(Collectors.toList());
        Map<String, Object> r = new HashMap<>();
        r.put("items", itemList);
        return ResponseEntity.ok(r);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> syncCart(@RequestBody Map<String, Integer> productQuantities,
                                                       HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        Map<Long, Integer> quantities = new HashMap<>();
        productQuantities.forEach((k, v) -> quantities.put(Long.parseLong(k), v));
        cartService.syncCart(customerId, quantities);
        return getCart(session);
    }
}
