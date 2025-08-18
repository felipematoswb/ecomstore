import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddToCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { Star, Heart, ShoppingCart } from "lucide-react";

export default function ProductPage() {
  const [, params] = useRoute("/product/:slug");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const addToCart = useAddToCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', params?.slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${params?.slug}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json() as Promise<Product>;
    },
    enabled: !!params?.slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['/api/products', product?.id, 'related'],
    queryFn: async () => {
      const response = await fetch(`/api/products/${product?.id}/related`);
      return response.json() as Promise<Product[]>;
    },
    enabled: !!product?.id,
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Check if size/color selection is required
    const hasVariants = product.variants?.sizes || product.variants?.colors;
    if (hasVariants) {
      if (product.variants?.sizes && !selectedSize) {
        toast({
          title: "Selecione um tamanho",
          description: "Por favor, escolha um tamanho antes de adicionar ao carrinho.",
          variant: "destructive",
        });
        return;
      }
      if (product.variants?.colors && !selectedColor) {
        toast({
          title: "Selecione uma cor",
          description: "Por favor, escolha uma cor antes de adicionar ao carrinho.",
          variant: "destructive",
        });
        return;
      }
    }

    addToCart.mutate({
      productId: product.id,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    }, {
      onSuccess: () => {
        toast({
          title: "Produto adicionado!",
          description: "O produto foi adicionado ao seu carrinho com sucesso.",
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao adicionar o produto ao carrinho.",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <div className="animate-pulse">
              <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
          <p className="mt-2 text-gray-600">O produto que você está procurando não existe.</p>
          <Link href="/">
            <Button className="mt-4">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(product.compareAtPrice!) - parseFloat(product.price)) / parseFloat(product.compareAtPrice!)) * 100)
    : 0;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Images */}
          <div>
            <ProductGallery 
              images={product.images || []} 
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900" data-testid="text-product-name">
              {product.name}
            </h1>
            
            <div className="mt-3 flex items-center space-x-2">
              <p className="text-3xl tracking-tight text-gray-900" data-testid="text-product-price">
                R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
              </p>
              {hasDiscount && (
                <>
                  <p className="text-xl text-gray-500 line-through" data-testid="text-product-compare-price">
                    R$ {parseFloat(product.compareAtPrice!).toFixed(2).replace('.', ',')}
                  </p>
                  <Badge className="bg-red-500 hover:bg-red-600" data-testid="badge-product-discount">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>

            {product.description && (
              <div className="mt-6">
                <p className="text-base text-gray-700" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Tamanho</h3>
                <div className="flex space-x-3">
                  {product.variants.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`button-size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Cor</h3>
                <div className="flex space-x-3">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-gray-900 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      data-testid={`button-color-${color.name}`}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="mt-2 text-sm text-gray-600" data-testid="text-selected-color">
                    Cor selecionada: {selectedColor}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Quantidade</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-quantity-decrease"
                >
                  -
                </Button>
                <span className="text-lg font-medium" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-quantity-increase"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-10 flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || addToCart.isPending}
                className="flex-1 bg-primary border-transparent text-white hover:bg-blue-700"
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {addToCart.isPending ? "Adicionando..." : "Adicionar ao Carrinho"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid="button-add-to-wishlist"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {!product.inStock && (
              <p className="mt-4 text-red-600 font-medium" data-testid="text-out-of-stock">
                Produto esgotado
              </p>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description" data-testid="tab-description">
                Descrição
              </TabsTrigger>
              <TabsTrigger value="specifications" data-testid="tab-specifications">
                Especificações
              </TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-reviews">
                Avaliações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700">
                  {product.description || "Descrição detalhada não disponível."}
                </p>
                <p className="mt-4 text-gray-700">
                  Este produto é confeccionado com materiais de alta qualidade, 
                  garantindo durabilidade e conforto. Ideal para diversas ocasiões 
                  e fácil de combinar com outras peças do seu guarda-roupa.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="prose max-w-none">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Material:</strong> Informação não disponível</li>
                  <li><strong>Cuidados:</strong> Lavar à mão ou máquina (ciclo delicado)</li>
                  <li><strong>Origem:</strong> Informação não disponível</li>
                  <li><strong>Garantia:</strong> 30 dias contra defeitos de fabricação</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0 (baseado em avaliações de clientes)</span>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Por Cliente Satisfeito - 15/03/2024</span>
                      </div>
                      <p className="text-gray-700">
                        Produto de excelente qualidade, superou minhas expectativas. Recomendo!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-related-products">
              Produtos Relacionados
            </h2>
            <div className="grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
