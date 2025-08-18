import { 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type Testimonial,
  type InsertTestimonial,
  type CartItemWithProduct
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(params?: {
    categoryId?: string;
    featured?: boolean;
    limit?: number;
    skip?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getRelatedProducts(productId: string, categoryId?: string, limit?: number): Promise<Product[]>;

  // Cart
  getCartItems(userId?: string, sessionId?: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, updates: Partial<InsertCartItem>): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId?: string, sessionId?: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;

  // Testimonials
  getTestimonials(featured?: boolean): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories: InsertCategory[] = [
      {
        name: "Moda Feminina",
        slug: "moda-feminina",
        description: "Vestidos, Blusas, Saias e muito mais",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        name: "Moda Masculina", 
        slug: "moda-masculina",
        description: "Camisas, Calças, Jaquetas e Acessórios",
        image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        name: "Acessórios",
        slug: "acessorios", 
        description: "Bolsas, Relógios, Joias e Bijuterias",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      },
      {
        name: "Calçados",
        slug: "calcados",
        description: "Tênis, Sapatos, Sandálias e Botas",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
      }
    ];

    categories.forEach(cat => this.createCategory(cat));

    // Get category IDs for products
    const femininaCat = Array.from(this.categories.values()).find(c => c.slug === 'moda-feminina');
    const masculinaCat = Array.from(this.categories.values()).find(c => c.slug === 'moda-masculina');
    const acessoriosCat = Array.from(this.categories.values()).find(c => c.slug === 'acessorios');
    const calcadosCat = Array.from(this.categories.values()).find(c => c.slug === 'calcados');

    // Seed products
    const products: InsertProduct[] = [
      {
        name: "Vestido Elegante Premium",
        slug: "vestido-elegante-premium",
        description: "Este elegante vestido é confeccionado com tecido de alta qualidade, proporcionando conforto e sofisticação para ocasiões especiais.",
        price: "299.90",
        compareAtPrice: "399.90",
        categoryId: femininaCat?.id,
        images: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
        ],
        variants: {
          sizes: ["P", "M", "G", "GG"],
          colors: [
            { name: "Preto", value: "#000000" },
            { name: "Azul", value: "#2563EB" },
            { name: "Vermelho", value: "#DC2626" }
          ]
        },
        featured: true,
        inStock: true
      },
      {
        name: "Tênis Casual Premium",
        slug: "tenis-casual-premium", 
        description: "Tênis confortável e moderno, perfeito para o dia a dia com muito estilo.",
        price: "189.90",
        categoryId: calcadosCat?.id,
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
        ],
        variants: {
          sizes: ["38", "39", "40", "41", "42", "43"],
          colors: [
            { name: "Branco", value: "#FFFFFF" },
            { name: "Preto", value: "#000000" }
          ]
        },
        featured: true,
        inStock: true
      },
      {
        name: "Bolsa de Couro Premium",
        slug: "bolsa-couro-premium",
        description: "Bolsa em couro genuíno com design elegante e acabamento impecável.",
        price: "459.90",
        compareAtPrice: "559.90",
        categoryId: acessoriosCat?.id,
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
        ],
        variants: {
          colors: [
            { name: "Marrom", value: "#8B4513" },
            { name: "Preto", value: "#000000" },
            { name: "Caramelo", value: "#D2691E" }
          ]
        },
        featured: true,
        inStock: true
      },
      {
        name: "Jaqueta Jeans Premium",
        slug: "jaqueta-jeans-premium",
        description: "Jaqueta jeans clássica com corte moderno e qualidade superior.",
        price: "199.90",
        categoryId: masculinaCat?.id,
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
        ],
        variants: {
          sizes: ["P", "M", "G", "GG"],
          colors: [
            { name: "Azul Clássico", value: "#4169E1" },
            { name: "Azul Escuro", value: "#191970" }
          ]
        },
        featured: true,
        inStock: true
      },
      {
        name: "Vestido Floral Verão",
        slug: "vestido-floral-verao",
        description: "Vestido leve e fresco com estampa floral, ideal para o verão.",
        price: "149.90",
        categoryId: femininaCat?.id,
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
        ],
        variants: {
          sizes: ["P", "M", "G"],
          colors: [
            { name: "Floral Rosa", value: "#FFB6C1" },
            { name: "Floral Azul", value: "#87CEEB" }
          ]
        },
        inStock: true
      },
      {
        name: "Blusa Casual Feminina",
        slug: "blusa-casual-feminina",
        description: "Blusa confortável e versátil para o dia a dia.",
        price: "89.90",
        categoryId: femininaCat?.id,
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
        ],
        variants: {
          sizes: ["P", "M", "G", "GG"],
          colors: [
            { name: "Branco", value: "#FFFFFF" },
            { name: "Rosa", value: "#FFB6C1" },
            { name: "Azul", value: "#87CEEB" }
          ]
        },
        inStock: true
      }
    ];

    products.forEach(prod => this.createProduct(prod));

    // Seed testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Maria Silva",
        content: "Produtos de excelente qualidade e entrega super rápida. Já comprei várias vezes e sempre fico satisfeita com o atendimento.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true
      },
      {
        name: "João Santos",
        content: "Site muito fácil de navegar e produtos com ótimo custo-benefício. Recomendo para todos os meus amigos!",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true
      },
      {
        name: "Ana Costa",
        content: "Adorei a experiência de compra! Os produtos são lindos e a qualidade superou minhas expectativas.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b723d15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true
      }
    ];

    testimonials.forEach(test => this.createTestimonial(test));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(params?: {
    categoryId?: string;
    featured?: boolean;
    limit?: number;
    skip?: number;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (params?.categoryId) {
      products = products.filter(p => p.categoryId === params.categoryId);
    }
    
    if (params?.featured !== undefined) {
      products = products.filter(p => p.featured === params.featured);
    }
    
    if (params?.skip) {
      products = products.slice(params.skip);
    }
    
    if (params?.limit) {
      products = products.slice(0, params.limit);
    }
    
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async getRelatedProducts(productId: string, categoryId?: string, limit = 4): Promise<Product[]> {
    let products = Array.from(this.products.values())
      .filter(p => p.id !== productId);
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }
    
    return products.slice(0, limit);
  }

  // Cart
  async getCartItems(userId?: string, sessionId?: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => {
        if (userId) return item.userId === userId;
        if (sessionId) return item.sessionId === sessionId;
        return false;
      });

    const itemsWithProduct: CartItemWithProduct[] = [];
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProduct.push({ ...item, product });
      }
    }

    return itemsWithProduct;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date()
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, updates: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId?: string, sessionId?: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([, item]) => {
        if (userId) return item.userId === userId;
        if (sessionId) return item.sessionId === sessionId;
        return false;
      })
      .map(([id]) => id);

    itemsToDelete.forEach(id => this.cartItems.delete(id));
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Testimonials
  async getTestimonials(featured?: boolean): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());
    
    if (featured !== undefined) {
      testimonials = testimonials.filter(t => t.featured === featured);
    }
    
    return testimonials;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
