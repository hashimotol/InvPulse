package com.inventorypulse.inventorypulse_backend.dto.inventory;

import java.time.Instant;

public record InventoryTransactionResponse(
        Long id,
        Long productId,
        Integer delta,
        String reason,
        String externalReference,
        String actor,
        Instant createdAt,
        Integer resultingStock
) { }
