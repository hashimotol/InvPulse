package com.inventorypulse.inventorypulse_backend.repository;

import com.inventorypulse.inventorypulse_backend.model.ImportBatch;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

 //Tracks CSV import batches. Useful for audit and preventing duplicate re-imports.
@Repository
public interface ImportBatchRepository extends JpaRepository<ImportBatch, Long> {
    Optional<ImportBatch> findByFileHash(String fileHash);
}
