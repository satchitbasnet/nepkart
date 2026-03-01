package com.nepkart.config;

import com.nepkart.model.Product;
import com.nepkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize sample products if database is empty
        if (productRepository.count() == 0) {
            Product product1 = new Product(
                "NEP-FOOD-001", "Wai Wai Noodles", "Food",
                BigDecimal.valueOf(2.99), 150, 20,
                BigDecimal.valueOf(0.1), "Kathmandu, Nepal"
            );
            product1.setDescription("Authentic Nepali instant noodles loved by millions.");
            product1.setImageUrl("/products/wai-wai.jpg");
            productRepository.save(product1);
            
            Product product2 = new Product(
                "NEP-FOOD-002", "Churpi", "Food",
                BigDecimal.valueOf(8.99), 45, 10,
                BigDecimal.valueOf(0.2), "Himalayan Region, Nepal"
            );
            product2.setDescription("Traditional hard cheese from the Himalayas.");
            product2.setImageUrl("/products/churpi.jpg");
            productRepository.save(product2);
            
            Product product3 = new Product(
                "NEP-FOOD-003", "Gundruk", "Food",
                BigDecimal.valueOf(6.99), 0, 15,
                BigDecimal.valueOf(0.3), "Nepal"
            );
            product3.setDescription("Fermented leafy vegetable, a staple in Nepali cuisine.");
            product3.setImageUrl("/products/gundruk.jpg");
            productRepository.save(product3);
            
            Product product4 = new Product(
                "NEP-FOOD-004", "Momo Masala", "Food",
                BigDecimal.valueOf(4.99), 30, 10,
                BigDecimal.valueOf(0.15), "Kathmandu, Nepal"
            );
            product4.setDescription("Spice mix for authentic momos.");
            product4.setImageUrl("/products/momomasala.jpg");
            productRepository.save(product4);
            
            Product product5 = new Product(
                "NEP-CLOTH-001", "Dhaka Topi", "Clothing",
                BigDecimal.valueOf(24.99), 20, 5,
                BigDecimal.valueOf(0.1), "Nepal"
            );
            product5.setDescription("Traditional Nepali cap, handwoven with intricate patterns.");
            product5.setImageUrl("/products/topi.jpg");
            productRepository.save(product5);
            
            Product product6 = new Product(
                "NEP-DECOR-001", "Copper Jug", "Decor",
                BigDecimal.valueOf(45.99), 12, 3,
                BigDecimal.valueOf(2.5), "Patan, Nepal"
            );
            product6.setDescription("Handcrafted copper water jug.");
            product6.setImageUrl("/products/jug.jpg");
            productRepository.save(product6);
            
            Product product7 = new Product(
                "NEP-DECOR-002", "Prayer Wheel", "Decor",
                BigDecimal.valueOf(35.99), 8, 2,
                BigDecimal.valueOf(1.2), "Tibet/Nepal"
            );
            product7.setDescription("Traditional Tibetan prayer wheel. Handcrafted with intricate details.");
            product7.setImageUrl("/products/praying-wheel.jpg");
            productRepository.save(product7);
            
            Product product8 = new Product(
                "NEP-FOOD-005", "Rice Bag (5kg)", "Food",
                BigDecimal.valueOf(12.99), 25, 5,
                BigDecimal.valueOf(5.0), "Terai, Nepal"
            );
            product8.setDescription("Premium Basmati rice from the Terai region.");
            product8.setImageUrl("/products/basmatirice.jpg");
            productRepository.save(product8);
            
            Product product9 = new Product(
                "NEP-DECOR-003", "Brass Panas Lamps", "Decor",
                BigDecimal.valueOf(129.99), 15, 3,
                BigDecimal.valueOf(2.8), "Patan, Nepal"
            );
            product9.setDescription("Handcrafted brass panas lamps. Traditional Nepali design with intricate patterns. Perfect for home decoration.");
            product9.setImageUrl("/products/lamps.jpg");
            productRepository.save(product9);
            
            Product product10 = new Product(
                "NEP-DECOR-004", "3-Set Moon Singing Bowl", "Decor",
                BigDecimal.valueOf(59.99), 20, 5,
                BigDecimal.valueOf(1.5), "Tibet/Nepal"
            );
            product10.setDescription("Set of three handcrafted Tibetan singing bowls. Each bowl produces a unique harmonic sound. Used for meditation and decoration.");
            product10.setImageUrl("/products/singing-bowl.jpg");
            productRepository.save(product10);
            
            Product product11 = new Product(
                "NEP-DECOR-005", "Tibetan Rug", "Decor",
                BigDecimal.valueOf(134.99), 10, 2,
                BigDecimal.valueOf(3.5), "Tibet/Nepal"
            );
            product11.setDescription("Authentic Tibetan handwoven rug. Beautiful traditional patterns and colors. Adds warmth and cultural elegance to any room.");
            product11.setImageUrl("/products/rug.jpg");
            productRepository.save(product11);
            
            Product product12 = new Product(
                "NEP-DECOR-006", "Antique Peacock Window", "Decor",
                BigDecimal.valueOf(179.99), 8, 2,
                BigDecimal.valueOf(4.2), "Kathmandu, Nepal"
            );
            product12.setDescription("Vintage-style peacock window frame. Intricate woodwork featuring traditional Nepali peacock motifs. A stunning decorative piece.");
            product12.setImageUrl("/products/window.jpg");
            productRepository.save(product12);
        }
    }
}
