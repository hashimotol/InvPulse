package com.inventorypulse.inventorypulse_backend.controller;

import com.inventorypulse.inventorypulse_backend.dto.product.CreateProductRequest;
import com.inventorypulse.inventorypulse_backend.dto.product.ProductResponse;
import com.inventorypulse.inventorypulse_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products  -> authenticated only
    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // POST /api/products -> ADMIN or MANAGER only
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request
    ) {
        ProductResponse created = productService.createProduct(request);
        URI location = URI.create("/api/products/" + created.id());
        return ResponseEntity.created(location).body(created);
    }
}
