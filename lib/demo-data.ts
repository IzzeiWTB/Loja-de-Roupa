import type { InstagramItem, Product, StoreSettings } from "@/lib/types";

export const demoSettings: StoreSettings = {
  id: true,
  store_name: "Sua Loja",
  tagline: "Moda escolhida para acompanhar a sua história.",
  hero_title: "Vista-se de presença.",
  hero_text:
    "Peças selecionadas no Brás, em Ibitinga e Minas Gerais, fotografadas em pessoas reais para você escolher com segurança.",
  hero_image_url:
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85",
  whatsapp_number: "5511999999999",
  instagram_url: null,
  instagram_enabled: false,
};

export const demoProducts: Product[] = [
  {
    id: "demo-fem-1",
    name: "Conjunto Aura",
    category: "Feminino",
    description: "Leve, elegante e pronto para acompanhar a sua rotina.",
    image_urls: ["https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85"],
    price: null,
    show_price: false,
    published: true,
    featured: true,
    display_order: 1,
    whatsapp_message: "Olá! Quero saber mais sobre o Conjunto Aura.",
  },
  {
    id: "demo-fem-2",
    name: "Vestido Horizonte",
    category: "Feminino",
    description: "Uma escolha marcante para dias que pedem leveza.",
    image_urls: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85"],
    price: 159.9,
    show_price: true,
    published: true,
    featured: true,
    display_order: 2,
    whatsapp_message: "Olá! Quero reservar o Vestido Horizonte.",
  },
  {
    id: "demo-men-1",
    name: "Camisa Essencial",
    category: "Masculino",
    description: "Caimento confortável com acabamento atemporal.",
    image_urls: ["https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=900&q=85"],
    price: null,
    show_price: false,
    published: true,
    featured: true,
    display_order: 3,
    whatsapp_message: "Olá! Quero saber mais sobre a Camisa Essencial.",
  },
  {
    id: "demo-men-2",
    name: "Jaqueta Movimento",
    category: "Masculino",
    description: "Versátil para criar combinações sem esforço.",
    image_urls: ["https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85"],
    price: 219.9,
    show_price: true,
    published: true,
    featured: false,
    display_order: 4,
    whatsapp_message: null,
  },
];

export const demoInstagramItems: InstagramItem[] = [];
