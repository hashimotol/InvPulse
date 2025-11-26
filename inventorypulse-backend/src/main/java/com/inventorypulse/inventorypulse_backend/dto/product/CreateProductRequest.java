package com.inventorypulse.inventorypulse_backend.dto.product;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateProductRequest(
        @NotBlank String sku,
        @NotBlank String title,
        String description,
        String brand,
        String category,
        String imageUrl,
        Integer stock,                 // optional; if null we default to 0
        @NotNull Integer reorderThreshold
) { }
