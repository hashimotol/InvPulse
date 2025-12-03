package com.inventorypulse.inventorypulse_backend.controller;

import com.inventorypulse.inventorypulse_backend.dto.product.CreateProductRequest;
import com.inventorypulse.inventorypulse_backend.dto.product.ProductResponse;
import com.inventorypulse.inventorypulse_backend.dto.product.UpdateProductRequest;
import com.inventorypulse.inventorypulse_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
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

    // GET /api/products/{id}  -> any authenticated user
    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
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

    // PUT /api/products/{id} -> ADMIN or MANAGER
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Validated @RequestBody UpdateProductRequest request
    ) {
        return productService.updateProduct(id, request);
    }

    // DELETE /api/products/{id} -> ADMIN or MANAGER
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/products/low-stock -> any authenticated user
    @GetMapping("/low-stock")
    public List<ProductResponse> getLowStockProducts() {
        return productService.getLowStockProducts();
    }

    // GET /api/products/search?q=... -> any authenticated user
    @GetMapping("/search")
    public List<ProductResponse> searchProducts(@RequestParam("q") String query) {
        return productService.searchProducts(query);
    }

}
