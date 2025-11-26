package com.inventorypulse.inventorypulse_backend.dto.product;

public record ProductResponse(
        Long id,
        String sku,
        String title,
        String description,
        String brand,
        String category,
        String imageUrl,
        Integer stock,
        Integer reorderThreshold
) { }
