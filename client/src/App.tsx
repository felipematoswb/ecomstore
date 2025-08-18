import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Collection from "@/pages/Collection";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/collection/:slug" component={Collection} />
        <Route path="/products" component={() => <Collection />} />
        <Route path="/product/:slug" component={Product} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/account/:tab?" component={Account} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/privacy" component={() => <div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1><p>Esta página está em construção.</p></div>} />
        <Route path="/terms" component={() => <div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-4">Termos de Serviço</h1><p>Esta página está em construção.</p></div>} />
        <Route path="/shipping" component={() => <div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-4">Política de Envio</h1><p>Esta página está em construção.</p></div>} />
        <Route path="/returns" component={() => <div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-4">Política de Devolução</h1><p>Esta página está em construção.</p></div>} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
