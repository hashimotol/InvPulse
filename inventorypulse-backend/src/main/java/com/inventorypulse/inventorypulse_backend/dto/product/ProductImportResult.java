package com.inventorypulse.inventorypulse_backend.dto.product;

public record ProductImportResult(
        int totalRows,
        int imported,
        int skipped
) { }
