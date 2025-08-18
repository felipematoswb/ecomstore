import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      question: "Como posso acompanhar meu pedido?",
      answer: "Você pode acompanhar seu pedido através da área 'Minha Conta' no site ou através do link de rastreamento enviado por email após a confirmação do pedido."
    },
    {
      question: "Qual é o prazo de entrega?",
      answer: "O prazo de entrega varia de acordo com sua localização. Para regiões metropolitanas, o prazo é de 3 a 5 dias úteis. Para outras regiões, pode levar de 5 a 10 dias úteis."
    },
    {
      question: "Como funciona a política de trocas e devoluções?",
      answer: "Você tem até 30 dias após o recebimento para solicitar troca ou devolução. Os produtos devem estar em perfeito estado, com etiquetas e embalagem original. O frete de devolução é por nossa conta."
    },
    {
      question: "Quais formas de pagamento vocês aceitam?",
      answer: "Aceitamos cartões de crédito (Visa, Mastercard, Elo), PIX, boleto bancário e parcelamento em até 12x sem juros para compras acima de R$ 200."
    },
    {
      question: "Como escolher o tamanho correto?",
      answer: "Cada produto tem uma tabela de medidas específica. Recomendamos medir suas dimensões e comparar com nossa tabela de tamanhos disponível na página do produto."
    },
    {
      question: "Vocês fazem entrega para todo o Brasil?",
      answer: "Sim, fazemos entregas para todo o território nacional. Os prazos e valores de frete variam conforme a localização e são calculados automaticamente no checkout."
    },
    {
      question: "Como posso alterar ou cancelar meu pedido?",
      answer: "Pedidos podem ser alterados ou cancelados em até 2 horas após a confirmação. Após esse período, entre em contato conosco para verificar a possibilidade de alteração."
    },
    {
      question: "Vocês oferecem garantia nos produtos?",
      answer: "Todos os nossos produtos possuem garantia de 30 dias contra defeitos de fabricação. Para roupas, também oferecemos garantia de qualidade do tecido e costura."
    },
    {
      question: "Como funciona o programa de fidelidade?",
      answer: "A cada compra você acumula pontos que podem ser convertidos em desconto nas próximas compras. Cadastre-se em nossa newsletter para receber ofertas exclusivas."
    },
    {
      question: "Posso retirar meu pedido na loja física?",
      answer: "Atualmente operamos apenas online. Todas as entregas são feitas pelos Correios ou transportadoras parceiras diretamente no endereço cadastrado."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl" data-testid="text-faq-title">
            Perguntas Frequentes
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600" data-testid="text-faq-subtitle">
            Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqData.map((item, index) => (
            <Card key={index} className="border border-gray-200" data-testid={`faq-item-${index}`}>
              <CardContent className="p-0">
                <button
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-lg flex items-center justify-between"
                  onClick={() => toggleItem(index)}
                  data-testid={`faq-question-${index}`}
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4" data-testid={`faq-answer-${index}`}>
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-faq-cta-title">
            Não encontrou sua resposta?
          </h2>
          <p className="text-gray-600 mb-6" data-testid="text-faq-cta-description">
            Nossa equipe de atendimento está pronta para ajudar você com qualquer dúvida.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              data-testid="link-faq-contact"
            >
              Entre em Contato
            </a>
            <a
              href="mailto:contato@modashop.com.br"
              className="inline-block bg-white text-primary border border-primary font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200"
              data-testid="link-faq-email"
            >
              Enviar Email
            </a>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="text-help-guide-title">
                Guia de Tamanhos
              </h3>
              <p className="text-gray-600 mb-4">
                Consulte nosso guia completo para encontrar o tamanho perfeito.
              </p>
              <a
                href="#"
                className="text-primary hover:text-blue-700 font-medium"
                data-testid="link-size-guide"
              >
                Ver Guia de Tamanhos →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="text-care-guide-title">
                Cuidados com o Produto
              </h3>
              <p className="text-gray-600 mb-4">
                Aprenda como cuidar das suas roupas para que durem mais tempo.
              </p>
              <a
                href="#"
                className="text-primary hover:text-blue-700 font-medium"
                data-testid="link-care-guide"
              >
                Ver Dicas de Cuidado →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
