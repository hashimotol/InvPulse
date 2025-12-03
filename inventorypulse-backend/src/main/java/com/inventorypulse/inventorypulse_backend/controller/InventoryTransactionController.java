package com.inventorypulse.inventorypulse_backend.controller;

import com.inventorypulse.inventorypulse_backend.dto.inventory.InventoryTransactionRequest;
import com.inventorypulse.inventorypulse_backend.dto.inventory.InventoryTransactionResponse;
import com.inventorypulse.inventorypulse_backend.service.InventoryTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService inventoryTransactionService;

    // GET /api/products/{productId}/transactions?limit=50
    // any authenticated user
    @GetMapping
    public List<InventoryTransactionResponse> getTransactionsForProduct(
            @PathVariable Long productId,
            @RequestParam(name = "limit", defaultValue = "50") int limit
    ) {
        return inventoryTransactionService.getRecentTransactionsForProduct(productId, limit);
    }

    // POST /api/products/{productId}/transactions
    // ADMIN or MANAGER only
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public InventoryTransactionResponse createTransaction(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryTransactionRequest request
    ) {
        String currentUserEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return inventoryTransactionService.createTransaction(productId, request, currentUserEmail);
    }
}
