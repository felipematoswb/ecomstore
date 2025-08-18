import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Users } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Paixão pela Moda",
      description: "Cada peça é selecionada com amor e atenção aos detalhes, pensando no que há de melhor para nossos clientes."
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Trabalhamos apenas com fornecedores confiáveis e materiais de primeira qualidade."
    },
    {
      icon: Users,
      title: "Atendimento Excepcional",
      description: "Nossa equipe está sempre pronta para ajudar e garantir a melhor experiência de compra."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl" data-testid="text-about-title">
            Sobre Nós
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600" data-testid="text-about-subtitle">
            Conheça nossa história, valores e a equipe apaixonada por moda que torna tudo possível.
          </p>
        </div>

        {/* Our Story */}
        <div className="mt-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="text-our-story-title">
                Nossa História
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500" data-testid="text-our-story-paragraph-1">
                Fundada em 2020, a ModaShop nasceu da paixão por democratizar a moda de qualidade. Nossa missão é oferecer peças exclusivas e tendências atuais com preços acessíveis, sem comprometer a qualidade e o estilo.
              </p>
              <p className="mt-3 max-w-3xl text-lg text-gray-500" data-testid="text-our-story-paragraph-2">
                Ao longo dos anos, construímos relacionamentos duradouros com nossos clientes, sempre priorizando a satisfação e a experiência de compra excepcional.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <img 
                className="rounded-lg shadow-lg" 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Nossa Loja"
                data-testid="img-our-story"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="text-values-title">
              Nossos Valores
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500" data-testid="text-values-subtitle">
              Os princípios que guiam nosso trabalho e relacionamento com clientes e parceiros.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center" data-testid={`card-value-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white mx-auto mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid={`text-value-title-${index}`}>
                      {value.title}
                    </h3>
                    <p className="text-base text-gray-500" data-testid={`text-value-description-${index}`}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-mission-title">
                  Nossa Missão
                </h3>
                <p className="text-gray-600" data-testid="text-mission-description">
                  Democratizar a moda de qualidade, oferecendo produtos excepcionais com preços acessíveis, 
                  garantindo que todos tenham acesso ao melhor da moda atual com o atendimento que merecem.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-vision-title">
                  Nossa Visão
                </h3>
                <p className="text-gray-600" data-testid="text-vision-description">
                  Ser reconhecida como a principal referência em moda online no Brasil, conhecida pela 
                  qualidade dos produtos, inovação no atendimento e compromisso com a satisfação do cliente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="text-team-title">
              Nossa Equipe
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500" data-testid="text-team-subtitle">
              Conheça as pessoas por trás da ModaShop que trabalham todos os dias para oferecer a melhor experiência.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {[
              {
                name: "Ana Silva",
                role: "CEO & Fundadora",
                image: "https://images.unsplash.com/photo-1494790108755-2616b723d15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
              },
              {
                name: "Carlos Santos",
                role: "Diretor de Produto",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
              },
              {
                name: "Maria Costa",
                role: "Diretora de Marketing",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
              }
            ].map((member, index) => (
              <Card key={index} className="text-center" data-testid={`card-team-member-${index}`}>
                <CardContent className="p-6">
                  <img
                    className="mx-auto h-32 w-32 rounded-full mb-4"
                    src={member.image}
                    alt={member.name}
                    data-testid={`img-team-member-${index}`}
                  />
                  <h3 className="text-lg font-medium text-gray-900" data-testid={`text-member-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-base text-gray-500" data-testid={`text-member-role-${index}`}>
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-primary rounded-lg">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white" data-testid="text-cta-title">
                Pronto para conhecer nossa coleção?
              </h2>
              <p className="mt-4 text-lg text-blue-100" data-testid="text-cta-description">
                Explore nossos produtos e descubra por que milhares de clientes confiam na ModaShop.
              </p>
              <div className="mt-8">
                <a
                  href="/"
                  className="inline-block bg-white text-primary font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
                  data-testid="link-cta-shop"
                >
                  Começar a Comprar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
