import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export const metadata: Metadata = {
  title: "Sua Loja | Moda selecionada para você",
  description: "Peças selecionadas no Brás, Ibitinga e Minas Gerais. Fale conosco pelo WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
