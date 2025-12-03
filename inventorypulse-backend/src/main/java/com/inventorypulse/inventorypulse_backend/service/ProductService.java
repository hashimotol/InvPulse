package com.inventorypulse.inventorypulse_backend.service;

import com.inventorypulse.inventorypulse_backend.dto.product.CreateProductRequest;
import com.inventorypulse.inventorypulse_backend.dto.product.ProductImportResult;
import com.inventorypulse.inventorypulse_backend.dto.product.ProductResponse;
import com.inventorypulse.inventorypulse_backend.dto.product.UpdateProductRequest;
import com.inventorypulse.inventorypulse_backend.model.Product;
import com.inventorypulse.inventorypulse_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public ProductImportResult importFromCsv(Reader reader) {
        int total = 0; //ToDO: change to no longer be hardcoded
        int imported = 0;
        int skipped = 0;

        try (BufferedReader br = new BufferedReader(reader)) {
            String line;

            // 1) Read header
            String header = br.readLine();
            if (header == null) {
                return new ProductImportResult(0, 0, 0);
            }

            while ((line = br.readLine()) != null) {
                total++;
                if (line.isBlank()) {
                    skipped++;
                    continue;
                }

                String[] parts = line.split(",", -1);
                if (parts.length < 8) {
                    skipped++;
                    continue;
                }

                String sku = parts[0].trim();
                String title = parts[1].trim();
                String description = parts[2].trim();
                String brand = parts[3].trim();
                String category = parts[4].trim();
                String imageUrl = parts[5].trim();
                Integer stock = parseIntSafe(parts[6]);
                Integer reorderThreshold = parseIntSafe(parts[7]);

                // basic required-field checks
                if (sku.isEmpty() || title.isEmpty() || reorderThreshold == null) {
                    skipped++;
                    continue;
                }

                try {
                    CreateProductRequest req = new CreateProductRequest(
                            sku,
                            title,
                            description,
                            brand,
                            category,
                            imageUrl,
                            stock,
                            reorderThreshold
                    );
                    createProduct(req);
                    imported++;
                } catch (ResponseStatusException ex) {
                    // e.g. duplicate SKU -> skip
                    skipped++;
                } catch (Exception ex) {
                    skipped++;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV", e);
        }

        return new ProductImportResult(total, imported, skipped);
    }

    private Integer parseIntSafe(String s) {
        try {
            if (s == null || s.isBlank()) return null;
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }


    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product with id " + id + " not found"
                ));
        return toProductResponse(product);
    }

    public ProductResponse createProduct(CreateProductRequest request) {
        if (productRepository.existsBySku(request.sku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Product with SKU '" + request.sku() + "' already exists"
            );
        }

        Integer stock = request.stock() != null ? request.stock() : 0;

        Product product = Product.builder()
                .sku(request.sku())
                .title(request.title())
                .description(request.description())
                .brand(request.brand())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .stock(stock)
                .reorderThreshold(request.reorderThreshold())
                .build();

        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }

    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product with id " + id + " not found"
                ));

        // If SKU is changing, ensure no duplicate
        if (!existing.getSku().equals(request.sku())
                && productRepository.existsBySku(request.sku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Product with SKU '" + request.sku() + "' already exists"
            );
        }

        existing.setSku(request.sku());
        existing.setTitle(request.title());
        existing.setDescription(request.description());
        existing.setBrand(request.brand());
        existing.setCategory(request.category());
        existing.setImageUrl(request.imageUrl());
        existing.setStock(request.stock());
        existing.setReorderThreshold(request.reorderThreshold());

        Product saved = productRepository.save(existing);
        return toProductResponse(saved);
    }

        public void deleteProduct(Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product with id " + id + " not found"
                ));

        productRepository.delete(existing);
    }

    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findProductsNeedingReorder()
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    public List<ProductResponse> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return getAllProducts();
        }

        return productRepository.searchByQuery(query, Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    private ProductResponse toProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getTitle(),
                product.getDescription(),
                product.getBrand(),
                product.getCategory(),
                product.getImageUrl(),
                product.getStock(),
                product.getReorderThreshold()
        );
    }
}
