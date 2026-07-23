export type Category = "Feminino" | "Masculino";

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  image_urls: string[];
  price: number | null;
  show_price: boolean;
  published: boolean;
  featured: boolean;
  display_order: number;
  whatsapp_message: string | null;
};

export type StoreSettings = {
  id: boolean;
  store_name: string;
  tagline: string;
  hero_title: string;
  hero_text: string;
  hero_image_url: string;
  whatsapp_number: string;
  instagram_url: string | null;
  instagram_enabled: boolean;
};

export type InstagramItem = {
  id: string;
  image_url: string;
  post_url: string | null;
  alt_text: string;
  display_order: number;
};

export type Storefront = {
  settings: StoreSettings;
  products: Product[];
  instagramItems: InstagramItem[];
  isDemo: boolean;
};
