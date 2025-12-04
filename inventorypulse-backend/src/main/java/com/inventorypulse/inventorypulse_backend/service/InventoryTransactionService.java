package com.inventorypulse.inventorypulse_backend.service;

import com.inventorypulse.inventorypulse_backend.dto.inventory.InventoryTransactionRequest;
import com.inventorypulse.inventorypulse_backend.dto.inventory.InventoryTransactionResponse;
import com.inventorypulse.inventorypulse_backend.model.InventoryTransaction;
import com.inventorypulse.inventorypulse_backend.model.Product;
import com.inventorypulse.inventorypulse_backend.repository.InventoryTransactionsRepository;
import com.inventorypulse.inventorypulse_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionsRepository transactionsRepository;
    private final ProductRepository productRepository;

    public List<InventoryTransactionResponse> getRecentTransactionsForProduct(Long productId, int limit) {
        // Ensure product exists
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product with id " + productId + " not found"
            );
        }

        return transactionsRepository.findRecentForProduct(productId, limit)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public InventoryTransactionResponse createTransaction(Long productId, InventoryTransactionRequest request, String actor
    ) {
        if (request.delta() == null || request.delta() == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "delta must be non-zero"
            );
        }

        if (request.externalReference() != null &&
                !request.externalReference().isBlank() &&
                transactionsRepository.existsByExternalReference(request.externalReference())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Transaction with external reference '" +
                            request.externalReference() + "' already exists"
            );
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product with id " + productId + " not found"
                ));

        int currentStock = product.getStock() != null ? product.getStock() : 0;
        int newStock = currentStock + request.delta();

        if (newStock < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stock cannot be negative (current: " + currentStock +
                            ", delta: " + request.delta() + ")"
            );
        }

        // Update stock
        product.setStock(newStock);
        productRepository.save(product);

        // Create transaction; createdAt is handled by DB
        InventoryTransaction tx = InventoryTransaction.builder()
                .product(product)
                .delta(request.delta())
                .reason(request.reason())
                .externalReference(request.externalReference())
                .actor(actor)
                .resultingStock(newStock)
                .build();

        InventoryTransaction saved = transactionsRepository.save(tx);

        return new InventoryTransactionResponse(
                saved.getId(),
                product.getId(),
                saved.getDelta(),
                saved.getReason(),
                saved.getExternalReference(),
                saved.getActor(),
                saved.getCreatedAt(),   // populated by DB
                saved.getResultingStock()
        );
    }

    private InventoryTransactionResponse toResponse(InventoryTransaction tx) {
        return new InventoryTransactionResponse(
                tx.getId(),
                tx.getProduct().getId(),
                tx.getDelta(),
                tx.getReason(),
                tx.getExternalReference(),
                tx.getActor(),
                tx.getCreatedAt(),
                tx.getResultingStock()
        );
    }
}
