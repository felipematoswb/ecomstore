import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCartQuery } from "@/hooks/useCart";
import { SHIPPING_COST, TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { ShoppingBag } from "lucide-react";

export default function Cart() {
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Load cart items from server
  useCartQuery();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) : 0;
  const tax = (subtotal - discount + shipping) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;

  const handleApplyCoupon = () => {
    // Mock coupon validation - in real app this would call an API
    const validCoupons = {
      'DESCONTO10': 0.10,
      'BEMVINDO': 0.15,
      'FRETE20': 0.20
    };

    const upperCode = couponCode.toUpperCase();
    if (validCoupons[upperCode as keyof typeof validCoupons]) {
      setAppliedCoupon({ 
        code: upperCode, 
        discount: validCoupons[upperCode as keyof typeof validCoupons] 
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  if (items.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900" data-testid="text-empty-cart-title">
              Seu carrinho está vazio
            </h1>
            <p className="mt-4 text-lg text-gray-600" data-testid="text-empty-cart-description">
              Adicione alguns produtos ao seu carrinho para continuar.
            </p>
            <div className="mt-8">
              <Link href="/">
                <Button data-testid="button-continue-shopping">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8" data-testid="text-cart-title">
          Carrinho de Compras
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Cart Items */}
          <section className="lg:col-span-8" data-testid="section-cart-items">
            <Card>
              <CardHeader>
                <CardTitle>Seus Produtos ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Order Summary */}
          <section className="mt-16 lg:mt-0 lg:col-span-4" data-testid="section-order-summary">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900" data-testid="text-subtotal">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </dd>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-green-600">
                    <dt className="text-sm">Desconto ({appliedCoupon.code})</dt>
                    <dd className="text-sm font-medium" data-testid="text-discount">
                      -R$ {discount.toFixed(2).replace('.', ',')}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Frete</dt>
                  <dd className="text-sm font-medium text-gray-900" data-testid="text-shipping">
                    {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Impostos</dt>
                  <dd className="text-sm font-medium text-gray-900" data-testid="text-tax">
                    R$ {tax.toFixed(2).replace('.', ',')}
                  </dd>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900" data-testid="text-total">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </dd>
                </div>

                {/* Coupon Code */}
                <div className="border-t pt-4">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                    Código de cupom
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
                      <span className="text-sm text-green-800">
                        Cupom {appliedCoupon.code} aplicado
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        data-testid="button-remove-coupon"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        id="coupon"
                        type="text"
                        placeholder="Insira o código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        data-testid="input-coupon-code"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        data-testid="button-apply-coupon"
                      >
                        Aplicar
                      </Button>
                    </div>
                  )}
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
                    Adicione mais R$ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2).replace('.', ',')} para ganhar frete grátis!
                  </div>
                )}

                <Link href="/checkout">
                  <Button className="w-full mt-6" data-testid="button-checkout">
                    Finalizar Compra
                  </Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continuar Comprando
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
