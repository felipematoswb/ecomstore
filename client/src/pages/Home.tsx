import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Product, Category, Testimonial } from "@shared/schema";
import { Star } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', { featured: true, limit: 4 }],
    queryFn: async () => {
      const response = await fetch('/api/products?featured=true&limit=4');
      return response.json() as Promise<Product[]>;
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json() as Promise<Category[]>;
    },
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['/api/testimonials', { featured: true }],
    queryFn: async () => {
      const response = await fetch('/api/testimonials?featured=true');
      return response.json() as Promise<Testimonial[]>;
    },
  });

  return (
    <div className="space-y-0">
      {/* Hero Banner */}
      <section className="relative bg-gray-50" data-testid="section-hero">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl" data-testid="text-hero-title">
              Nova Coleção 2024
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200 sm:max-w-3xl" data-testid="text-hero-description">
              Descubra as últimas tendências da moda com nossa coleção exclusiva de roupas e acessórios.
            </p>
            <div className="mt-10">
              <Link href="/collection/moda-feminina">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8"
                  data-testid="button-hero-cta"
                >
                  Explorar Coleção
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white" data-testid="section-featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="text-featured-products-title">
              Produtos em Destaque
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500" data-testid="text-featured-products-description">
              Selecionamos os melhores produtos da nossa coleção especialmente para você.
            </p>
          </div>

          {productsLoading ? (
            <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
                  <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {featuredProducts?.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="text-categories-title">
              Categorias Populares
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500" data-testid="text-categories-description">
              Explore nossas categorias mais procuradas e encontre exatamente o que você está buscando.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories?.slice(0, 3).map((category) => (
                <Link 
                  key={category.id} 
                  href={`/collection/${category.slug}`}
                >
                  <div className="group relative cursor-pointer" data-testid={`card-category-${category.id}`}>
                    <div className="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 transition-opacity">
                      <img
                        src={category.image || "/placeholder-category.jpg"}
                        alt={category.name}
                        className="w-full h-full object-center object-cover"
                        data-testid={`img-category-${category.id}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-lg font-medium text-white" data-testid={`text-category-name-${category.id}`}>
                          {category.name}
                        </h3>
                        <span className="text-sm text-gray-200" data-testid={`text-category-description-${category.id}`}>
                          {category.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="text-testimonials-title">
              O que nossos clientes dizem
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500" data-testid="text-testimonials-description">
              Veja os depoimentos de quem já experimentou nossos produtos e se apaixonou pela qualidade.
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {testimonials?.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-gray-50 rounded-lg p-6"
                  data-testid={`card-testimonial-${testimonial.id}`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={testimonial.avatar || "/placeholder-avatar.jpg"}
                        alt={testimonial.name}
                        data-testid={`img-testimonial-avatar-${testimonial.id}`}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900" data-testid={`text-testimonial-name-${testimonial.id}`}>
                        {testimonial.name}
                      </p>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            data-testid={`icon-testimonial-star-${testimonial.id}-${i}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-base text-gray-600" data-testid={`text-testimonial-content-${testimonial.id}`}>
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
