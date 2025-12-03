package com.inventorypulse.inventorypulse_backend.service;

import com.inventorypulse.inventorypulse_backend.dto.product.CreateProductRequest;
import com.inventorypulse.inventorypulse_backend.dto.product.ProductResponse;
import com.inventorypulse.inventorypulse_backend.model.Product;
import com.inventorypulse.inventorypulse_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

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
