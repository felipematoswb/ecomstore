import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  showAddToCart?: boolean;
}

export function ProductCard({ product, onAddToCart, showAddToCart = false }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(product.compareAtPrice!) - parseFloat(product.price)) / parseFloat(product.compareAtPrice!)) * 100)
    : 0;

  return (
    <div className="group relative" data-testid={`card-product-${product.id}`}>
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group-hover:opacity-75 transition-opacity">
        <img
          src={product.images?.[0] || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-center object-cover"
          data-testid={`img-product-${product.id}`}
        />
        {hasDiscount && (
          <Badge 
            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600"
            data-testid={`badge-discount-${product.id}`}
          >
            -{discountPercent}%
          </Badge>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700" data-testid={`text-product-name-${product.id}`}>
            <Link href={`/product/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0"></span>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500" data-testid={`text-product-category-${product.id}`}>
            {product.categoryId}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900" data-testid={`text-product-price-${product.id}`}>
            R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
          </p>
          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through" data-testid={`text-product-compare-price-${product.id}`}>
              R$ {parseFloat(product.compareAtPrice!).toFixed(2).replace('.', ',')}
            </p>
          )}
        </div>
      </div>
      
      {showAddToCart && (
        <Button
          onClick={onAddToCart}
          className="mt-2 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          Adicionar ao Carrinho
        </Button>
      )}
    </div>
  );
}
