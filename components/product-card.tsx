import { whatsappUrl } from "@/lib/content";
import type { Product } from "@/lib/types";

type ProductCardProps = { product: Product; whatsappNumber: string };

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const message = product.whatsapp_message || `Olá! Quero saber mais sobre ${product.name}.`;
  const price = product.show_price && product.price !== null
    ? product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "Consulte no WhatsApp";

  return (
    <article className="product-card">
      <a href={whatsappUrl(whatsappNumber, message)} target="_blank" rel="noreferrer" className="product-image-link" aria-label={`Consultar ${product.name} no WhatsApp`}>
        <img src={product.image_urls[0]} alt={product.name} className="product-image" />
        <span className="product-action">Ver detalhes <span aria-hidden="true">↗</span></span>
      </a>
      <div className="product-details">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <strong>{price}</strong>
      </div>
    </article>
  );
}
