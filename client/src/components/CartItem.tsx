import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItemWithProduct } from "@shared/schema";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateCartItem.mutate({ id: item.id, quantity: newQuantity });
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.id);
  };

  const itemTotal = parseFloat(item.product.price) * quantity;

  return (
    <div className="flex py-6 border-b border-gray-200" data-testid={`cart-item-${item.id}`}>
      <div className="flex-shrink-0">
        <img
          src={item.product.images?.[0] || "/placeholder-product.jpg"}
          alt={item.product.name}
          className="w-24 h-24 rounded-lg object-center object-cover"
          data-testid={`img-cart-item-${item.id}`}
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900" data-testid={`text-cart-item-name-${item.id}`}>
              {item.product.name}
            </h3>
            
            <div className="mt-1 flex text-sm text-gray-500">
              {item.selectedColor && (
                <span data-testid={`text-cart-item-color-${item.id}`}>
                  Cor: {item.selectedColor}
                </span>
              )}
              {item.selectedSize && (
                <span 
                  className={item.selectedColor ? "ml-4 pl-4 border-l border-gray-200" : ""}
                  data-testid={`text-cart-item-size-${item.id}`}
                >
                  Tamanho: {item.selectedSize}
                </span>
              )}
            </div>
            
            <p className="mt-1 text-base font-medium text-gray-900" data-testid={`text-cart-item-price-${item.id}`}>
              R$ {parseFloat(item.product.price).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updateCartItem.isPending}
                data-testid={`button-cart-item-decrease-${item.id}`}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 border-0 text-center"
                data-testid={`input-cart-item-quantity-${item.id}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={updateCartItem.isPending}
                data-testid={`button-cart-item-increase-${item.id}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={removeFromCart.isPending}
              className="text-red-500 hover:text-red-700"
              data-testid={`button-cart-item-remove-${item.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="text-sm text-gray-500">
            Subtotal: 
            <span className="font-medium text-gray-900 ml-1" data-testid={`text-cart-item-subtotal-${item.id}`}>
              R$ {itemTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
