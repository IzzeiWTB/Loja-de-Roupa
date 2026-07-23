import { createClient } from "@supabase/supabase-js";
import { demoInstagramItems, demoProducts, demoSettings } from "@/lib/demo-data";
import type { Storefront } from "@/lib/types";

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getStorefront(): Promise<Storefront> {
  if (!isSupabaseConfigured()) {
    return { settings: demoSettings, products: demoProducts, instagramItems: demoInstagramItems, isDemo: true };
  }

  try {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const [settingsResult, productsResult, instagramResult] = await Promise.all([
      client.from("site_settings").select("*").eq("id", true).single(),
      client.from("products").select("*").eq("published", true).order("display_order"),
      client.from("instagram_items").select("*").order("display_order"),
    ]);

    return {
      settings: settingsResult.data ?? demoSettings,
      products: productsResult.data ?? demoProducts,
      instagramItems: instagramResult.data ?? [],
      isDemo: false,
    };
  } catch {
    return { settings: demoSettings, products: demoProducts, instagramItems: demoInstagramItems, isDemo: true };
  }
}

export function whatsappUrl(number: string, message: string) {
  const cleanedNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
}
