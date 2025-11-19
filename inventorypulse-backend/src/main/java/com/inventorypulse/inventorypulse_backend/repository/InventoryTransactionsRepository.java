package com.inventorypulse.inventorypulse_backend.repository;

import com.inventorypulse.inventorypulse_backend.model.InventoryTransaction;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryTransactionsRepository extends JpaRepository<InventoryTransaction, Long> {


    boolean existsByExternalReference(String externalReference);

    //Find recent transactions for a product (for history view). 
    List<InventoryTransaction> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    //Optionally fetch the latest N transactions for a product.
    default List<InventoryTransaction> findRecentForProduct(Long productId, int limit) {
        return findByProductIdOrderByCreatedAtDesc(productId, Pageable.ofSize(limit));
    }
}
