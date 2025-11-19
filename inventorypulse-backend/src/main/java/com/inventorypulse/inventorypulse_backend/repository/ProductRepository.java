package com.inventorypulse.inventorypulse_backend.repository;


import com.inventorypulse.inventorypulse_backend.model.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
   Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    @Query("SELECT p FROM Product p " +
           "WHERE lower(p.title) LIKE lower(concat('%', :q, '%')) " +
           "   OR lower(p.sku) LIKE lower(concat('%', :q, '%')) " +
           "   OR (p.brand IS NOT NULL AND lower(p.brand) LIKE lower(concat('%', :q, '%')))")
    Page<Product> searchByQuery(String q, Pageable pageable);

    // Products that are at or below reorder threshold
    @Query("SELECT p FROM Product p WHERE p.stock <= p.reorderThreshold")
    List<Product> findProductsNeedingReorder();
}