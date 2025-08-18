import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { CartItemWithProduct, InsertCartItem } from "@shared/schema";

export function useCartQuery() {
  const { user } = useAuth();
  const { sessionId, setItems } = useCart();
  
  return useQuery({
    queryKey: ['/api/cart', { userId: user?.id, sessionId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.id) {
        params.append('userId', user.id);
      } else {
        params.append('sessionId', sessionId);
      }
      
      const response = await fetch(`/api/cart?${params}`);
      const items = await response.json();
      setItems(items);
      return items as CartItemWithProduct[];
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { sessionId, addItem } = useCart();
  
  return useMutation({
    mutationFn: async (data: Omit<InsertCartItem, 'userId' | 'sessionId'>) => {
      const cartItem = {
        ...data,
        userId: user?.id,
        sessionId: user?.id ? undefined : sessionId,
      };
      
      const response = await apiRequest('POST', '/api/cart', cartItem);
      return response.json();
    },
    onSuccess: (newItem, variables) => {
      // Optimistically add to cart context
      const productResponse = fetch(`/api/products/${variables.productId}`);
      productResponse.then(res => res.json()).then(product => {
        addItem({ ...newItem, product });
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/cart'] 
      });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { updateItem } = useCart();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: (_, variables) => {
      updateItem(variables.id, variables.quantity);
      queryClient.invalidateQueries({ 
        queryKey: ['/api/cart'] 
      });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { removeItem } = useCart();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: (_, id) => {
      removeItem(id);
      queryClient.invalidateQueries({ 
        queryKey: ['/api/cart'] 
      });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { sessionId, clearCart } = useCart();
  
  return useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      if (user?.id) {
        params.append('userId', user.id);
      } else {
        params.append('sessionId', sessionId);
      }
      
      await apiRequest('DELETE', `/api/cart?${params}`);
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ 
        queryKey: ['/api/cart'] 
      });
    },
  });
}
