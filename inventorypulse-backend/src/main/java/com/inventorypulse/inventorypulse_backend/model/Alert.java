package com.inventorypulse.inventorypulse_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "product")
public class Alert {

 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // DB column is `type`
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "message", columnDefinition = "text", nullable = false)
    private String message;

    // DB column is `seen` boolean
    @Column(name = "seen", nullable = false)
    @Builder.Default
    private boolean seen = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;
}

