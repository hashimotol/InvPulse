// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../lib/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/products">← Back to products</Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div>
      <div>
        <h1>{product.title}</h1>
        <p>SKU: {product.sku}</p>
        <Link to="/products">← Back to products</Link>
      </div>

      <div>
        <h2>Product Details</h2>
        <p>Current Stock: {product.stock}</p>
      </div>
    </div>
  );
}