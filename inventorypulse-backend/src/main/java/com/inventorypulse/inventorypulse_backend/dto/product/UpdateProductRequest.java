package com.inventorypulse.inventorypulse_backend.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateProductRequest(
        @NotBlank String sku,
        @NotBlank String title,
        String description,
        String brand,
        String category,
        String imageUrl,
        @NotNull @Min(0) Integer stock,
        @NotNull @Min(0) Integer reorderThreshold
) { }
