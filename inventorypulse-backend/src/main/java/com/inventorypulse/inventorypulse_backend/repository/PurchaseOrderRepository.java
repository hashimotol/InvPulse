package com.inventorypulse.inventorypulse_backend.repository;

import com.inventorypulse.inventorypulse_backend.model.PurchaseOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    /**
     * V1 status values: PENDING, RECEIVED, CANCELLED
     */
    List<PurchaseOrder> findByStatusOrderByCreatedAtDesc(String status);

    List<PurchaseOrder> findBySupplierIdOrderByCreatedAtDesc(Long supplierId);
}
