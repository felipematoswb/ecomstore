import { useState } from "react";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/newsletter', { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Você foi inscrito em nossa newsletter com sucesso.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao inscrever na newsletter. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  const quickLinks = [
    { name: 'Início', href: '/' },
    { name: 'Coleções', href: '/collection/moda-feminina' },
    { name: 'Produtos', href: '/products' },
    { name: 'Sobre Nós', href: '/about' },
    { name: 'Contato', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  const policyLinks = [
    { name: 'Política de Privacidade', href: '/privacy' },
    { name: 'Termos de Serviço', href: '/terms' },
    { name: 'Política de Envio', href: '/shipping' },
    { name: 'Política de Devolução', href: '/returns' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" data-testid="text-footer-title">ModaShop</h3>
            <p className="text-gray-300 mb-6 max-w-md" data-testid="text-footer-description">
              Sua loja de moda online com as melhores tendências, qualidade garantida e preços que cabem no seu bolso.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-400 hover:text-white transition duration-200"
                  aria-label={label}
                  data-testid={`link-social-${label.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition duration-200"
                    data-testid={`link-footer-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition duration-200"
                    data-testid={`link-policy-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2" data-testid="text-newsletter-title">
                Receba nossas novidades
              </h4>
              <p className="text-gray-300" data-testid="text-newsletter-description">
                Inscreva-se e seja o primeiro a saber sobre promoções e lançamentos.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <form className="flex" onSubmit={handleNewsletterSubmit}>
                <Input
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none bg-white text-gray-900 border-gray-300"
                  required
                  data-testid="input-newsletter-email"
                />
                <Button
                  type="submit"
                  className="rounded-l-none bg-primary hover:bg-blue-700"
                  disabled={newsletterMutation.isPending}
                  data-testid="button-newsletter-subscribe"
                >
                  {newsletterMutation.isPending ? "Enviando..." : "Inscrever"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400" data-testid="text-copyright">
            © 2024 ModaShop. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
