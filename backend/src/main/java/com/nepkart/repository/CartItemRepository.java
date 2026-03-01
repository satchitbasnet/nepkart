package com.nepkart.repository;

import com.nepkart.model.CartItem;
import com.nepkart.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomer_IdOrderByIdAsc(Long customerId);
    Optional<CartItem> findByCustomer_IdAndProduct_Id(Long customerId, Long productId);
    void deleteByCustomer_Id(Long customerId);
}
