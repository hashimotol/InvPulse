package com.inventorypulse.inventorypulse_backend.dto.inventory;

import jakarta.validation.constraints.NotNull;

public record InventoryTransactionRequest(
        /**
         * Positive = add stock, negative = remove stock.
         * Must be non-zero (we enforce that in service).
         */
        @NotNull Integer delta,
        String reason,
        String externalReference
) { }
