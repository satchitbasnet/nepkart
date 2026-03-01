package com.nepkart.service;

import com.nepkart.model.CartItem;
import com.nepkart.model.Customer;
import com.nepkart.model.Product;
import com.nepkart.repository.CartItemRepository;
import com.nepkart.repository.CustomerRepository;
import com.nepkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<CartItem> getCart(Long customerId) {
        return cartItemRepository.findByCustomer_IdOrderByIdAsc(customerId);
    }
    
    @Transactional
    public List<CartItem> syncCart(Long customerId, Map<Long, Integer> productQuantities) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        for (Map.Entry<Long, Integer> entry : productQuantities.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();
            if (quantity <= 0) continue;
            
            Product product = productRepository.findById(productId)
                .orElse(null);
            if (product == null) continue;
            
            var existing = cartItemRepository.findByCustomer_IdAndProduct_Id(customerId, productId);
            if (existing.isPresent()) {
                CartItem item = existing.get();
                item.setQuantity(Math.min(quantity, product.getStock()));
                cartItemRepository.save(item);
            } else {
                CartItem item = new CartItem(customer, product, Math.min(quantity, product.getStock()));
                cartItemRepository.save(item);
            }
        }
        
        return cartItemRepository.findByCustomer_IdOrderByIdAsc(customerId);
    }
    
    @Transactional
    public void clearCart(Long customerId) {
        cartItemRepository.deleteByCustomer_Id(customerId);
    }
}
