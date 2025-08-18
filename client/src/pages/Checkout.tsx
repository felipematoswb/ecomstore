import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useClearCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BRAZILIAN_STATES, SHIPPING_COST, TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useLocation } from "wouter";
import { CheckCircle, CreditCard, Smartphone, FileText } from "lucide-react";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  postalCode: z.string().min(1, "CEP é obrigatório"),
  paymentMethod: z.enum(["credit-card", "pix", "bank-slip"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const steps = [
  { id: 1, name: "Informações", icon: FileText },
  { id: 2, name: "Entrega", icon: CheckCircle },
  { id: 3, name: "Pagamento", icon: CreditCard },
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const clearCart = useClearCart();
  const { toast } = useToast();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      paymentMethod: "credit-card",
    },
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = (subtotal + shipping) * TAX_RATE;
  const total = subtotal + shipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const orderData = {
        userId: user?.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        total: total.toString(),
        status: "pending",
        items: items.map(item => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.product.images?.[0],
        })),
      };

      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart.mutate();
      toast({
        title: "Pedido confirmado!",
        description: `Seu pedido #${order.id.slice(-8)} foi criado com sucesso.`,
      });
      setLocation(`/account/orders`);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      createOrderMutation.mutate(data);
    }
  };

  const paymentMethod = form.watch("paymentMethod");

  if (items.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Carrinho vazio</h1>
          <p className="mt-2 text-gray-600">Adicione produtos ao carrinho antes de finalizar a compra.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8" data-testid="text-checkout-title">
          Finalizar Compra
        </h1>

        {/* Progress Steps */}
        <nav className="mb-8" data-testid="nav-checkout-steps">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <li key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted || isCurrent
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 text-gray-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isCompleted || isCurrent ? "text-primary" : "text-gray-500"
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-8 w-8 h-0.5 ${
                      isCompleted ? "bg-primary" : "bg-gray-300"
                    }`} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Checkout Form */}
          <section className="lg:col-span-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Contact Information */}
                {currentStep >= 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className={`w-5 h-5 mr-2 ${currentStep > 1 ? "text-green-500" : "text-gray-400"}`} />
                        Informações de Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sobrenome</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep >= 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className={`w-5 h-5 mr-2 ${currentStep > 2 ? "text-green-500" : "text-gray-400"}`} />
                        Endereço de Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-state">
                                  <SelectValue placeholder="Selecione o estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {BRAZILIAN_STATES.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="00000-000" data-testid="input-postal-code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Payment Method */}
                {currentStep >= 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                        Método de Pagamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-4"
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="credit-card" id="credit-card" data-testid="radio-credit-card" />
                                  <Label htmlFor="credit-card" className="flex items-center">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Cartão de Crédito
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="pix" id="pix" data-testid="radio-pix" />
                                  <Label htmlFor="pix" className="flex items-center">
                                    <Smartphone className="w-4 h-4 mr-2" />
                                    PIX
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="bank-slip" id="bank-slip" data-testid="radio-bank-slip" />
                                  <Label htmlFor="bank-slip" className="flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Boleto Bancário
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {paymentMethod === "credit-card" && (
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 border-t pt-6">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>Número do cartão</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="1234 5678 9012 3456" data-testid="input-card-number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data de validade</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="MM/AA" data-testid="input-expiry-date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="123" data-testid="input-cvv" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      data-testid="button-previous-step"
                    >
                      Voltar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="ml-auto"
                    data-testid="button-next-step"
                  >
                    {currentStep === 3 
                      ? (createOrderMutation.isPending ? "Processando..." : "Finalizar Pedido")
                      : "Continuar"
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </section>

          {/* Order Summary */}
          <section className="mt-16 lg:mt-0 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span>R$ {(parseFloat(item.product.price) * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium" data-testid="text-checkout-subtotal">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frete</span>
                  <span className="text-sm font-medium" data-testid="text-checkout-shipping">
                    {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Impostos</span>
                  <span className="text-sm font-medium" data-testid="text-checkout-tax">
                    R$ {tax.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-base font-medium" data-testid="text-checkout-total">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
