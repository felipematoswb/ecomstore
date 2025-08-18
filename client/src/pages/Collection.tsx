import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, Category } from "@shared/schema";
import { PRODUCT_SORT_OPTIONS } from "@/lib/constants";

export default function Collection() {
  const [, params] = useRoute("/collection/:slug");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: category } = useQuery({
    queryKey: ['/api/categories', params?.slug],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${params?.slug}`);
      return response.json() as Promise<Category>;
    },
    enabled: !!params?.slug,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', { categoryId: category?.id }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category?.id) {
        params.append('categoryId', category.id);
      }
      
      const response = await fetch(`/api/products?${params}`);
      return response.json() as Promise<Product[]>;
    },
    enabled: !!category?.id,
  });

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filters
    if (priceFilters.length > 0) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return priceFilters.some(filter => {
          switch (filter) {
            case "0-50": return price <= 50;
            case "50-100": return price > 50 && price <= 100;
            case "100-200": return price > 100 && price <= 200;
            case "200+": return price > 200;
            default: return true;
          }
        });
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, priceFilters, sortBy]);

  const handlePriceFilterChange = (filter: string, checked: boolean) => {
    setPriceFilters(prev => 
      checked 
        ? [...prev, filter]
        : prev.filter(f => f !== filter)
    );
  };

  if (!params?.slug) {
    return <div>Categoria não encontrada</div>;
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {category && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900" data-testid="text-collection-title">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 text-xl text-gray-600" data-testid="text-collection-description">
                {category.description}
              </p>
            )}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900" data-testid="text-filters-title">
                Filtros
              </h3>
            </div>
            
            {/* Search */}
            <div>
              <Label htmlFor="search" className="text-sm font-medium text-gray-900">
                Buscar produtos
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Digite o nome do produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2"
                data-testid="input-search-products"
              />
            </div>

            {/* Price Filters */}
            <div className="border-b border-gray-200 py-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Preço</h3>
              <div className="space-y-3">
                {[
                  { value: "0-50", label: "Até R$ 50" },
                  { value: "50-100", label: "R$ 50 - R$ 100" },
                  { value: "100-200", label: "R$ 100 - R$ 200" },
                  { value: "200+", label: "Acima de R$ 200" },
                ].map((filter) => (
                  <div key={filter.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={`price-${filter.value}`}
                      checked={priceFilters.includes(filter.value)}
                      onCheckedChange={(checked) => 
                        handlePriceFilterChange(filter.value, checked as boolean)
                      }
                      data-testid={`checkbox-price-${filter.value}`}
                    />
                    <Label 
                      htmlFor={`price-${filter.value}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="py-6">
              <Label className="text-sm font-medium text-gray-900 mb-4 block">
                Ordenar por
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SORT_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      data-testid={`sort-option-${option.value}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6 space-y-4">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-mobile-search-products"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-mobile-sort">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            <div className="mb-6">
              <p className="text-sm text-gray-500" data-testid="text-products-count">
                {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {isLoading ? (
              <div className="grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
                    <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500" data-testid="text-no-products">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    showAddToCart
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
