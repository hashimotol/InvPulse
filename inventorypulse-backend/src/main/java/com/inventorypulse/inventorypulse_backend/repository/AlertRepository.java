package com.inventorypulse.inventorypulse_backend.repository;

import com.inventorypulse.inventorypulse_backend.model.Alert;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findBySeenFalseOrderByCreatedAtDesc();


    List<Alert> findByProductIdAndSeenFalseOrderByCreatedAtDesc(Long productId);


    List<Alert> findByTypeOrderByCreatedAtDesc(String type);
}
