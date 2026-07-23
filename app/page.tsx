import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { getStorefront, whatsappUrl } from "@/lib/content";

export default async function Home() {
  const { settings, products, instagramItems, isDemo } = await getStorefront();
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const women = products.filter((product) => product.category === "Feminino").slice(0, 3);
  const men = products.filter((product) => product.category === "Masculino").slice(0, 3);
  const whatsAppIntro = "Olá! Quero receber novidades e modelos exclusivos da loja.";

  return (
    <main id="inicio">
      {isDemo && <div className="demo-bar">Modo demonstração — configure o Supabase para publicar o conteúdo da sua loja.</div>}
      <SiteHeader storeName={settings.store_name} />

      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">Curadoria com propósito</p>
          <h1>{settings.hero_title}</h1>
          <p className="hero-text">{settings.hero_text}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#colecao">Conheça a coleção <span aria-hidden="true">↓</span></a>
            <a className="text-link" href={whatsappUrl(settings.whatsapp_number, whatsAppIntro)} target="_blank" rel="noreferrer">Receber novidades no WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="hero-media">
          <img src={settings.hero_image_url} alt="Pessoa usando uma peça da coleção" />
          <p>Moda real, para pessoas reais.</p>
        </div>
      </section>

      <section className="category-bar section-shell" aria-label="Categorias">
        <a href="#feminino"><span>01</span> Moda feminina <b aria-hidden="true">↘</b></a>
        <a href="#masculino"><span>02</span> Moda masculina <b aria-hidden="true">↘</b></a>
      </section>

      <section id="colecao" className="collection-section section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">Seleção da semana</p><h2>Peças que contam <em>a sua história.</em></h2></div>
          <p>Você vê como cada peça ganha vida em pessoas reais — e chama a gente quando encontrar a sua.</p>
        </div>
        {featured.length > 0 ? <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.whatsapp_number} />)}</div> : <p className="empty-state">Novas peças estão chegando. Chame no WhatsApp para conhecer a seleção atual.</p>}
      </section>

      <section id="sobre" className="story-section">
        <div className="story-photo"><img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1100&q=85" alt="Duas pessoas escolhendo roupas" /></div>
        <div className="story-copy"><p className="eyebrow">Por trás de cada escolha</p><h2>Uma curadoria que vai até você.</h2><p>Buscamos peças em polos que respiram moda — Brás, Ibitinga e Minas Gerais — para montar uma seleção diversa, atual e especial.</p><p>Mais do que mostrar roupa, queremos ajudar você a se enxergar nela.</p><div className="origin-list"><span>Brás · SP</span><span>Ibitinga · SP</span><span>Minas Gerais</span></div></div>
      </section>

      <section id="feminino" className="category-collection section-shell">
        <div className="category-title"><p className="eyebrow">01 — Feminino</p><h2>Para se sentir <em>você.</em></h2></div>
        <div className="product-grid compact-grid">{women.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.whatsapp_number} />)}</div>
      </section>

      <section id="masculino" className="category-collection section-shell alt-section">
        <div className="category-title"><p className="eyebrow">02 — Masculino</p><h2>Estilo que acompanha <em>o movimento.</em></h2></div>
        <div className="product-grid compact-grid">{men.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.whatsapp_number} />)}</div>
      </section>

      {settings.instagram_enabled && settings.instagram_url && instagramItems.length > 0 && (
        <section className="instagram-section section-shell" aria-labelledby="instagram-title">
          <div className="section-heading"><div><p className="eyebrow">Acompanhe de perto</p><h2 id="instagram-title">No nosso <em>Instagram.</em></h2></div><a className="text-link" href={settings.instagram_url} target="_blank" rel="noreferrer">Seguir perfil <span aria-hidden="true">↗</span></a></div>
          <div className="instagram-rail">{instagramItems.map((item) => <a key={item.id} href={item.post_url || settings.instagram_url!} target="_blank" rel="noreferrer"><img src={item.image_url} alt={item.alt_text || "Post da loja no Instagram"} /></a>)}</div>
        </section>
      )}

      <section id="novidades" className="newsletter-section section-shell">
        <div><p className="eyebrow">Sempre por perto</p><h2>Receba as novidades <em>primeiro.</em></h2></div>
        <div><p>Entre no nosso WhatsApp para receber fotos, lançamentos e aquela peça que é a sua cara.</p><a className="button button-light" href={whatsappUrl(settings.whatsapp_number, whatsAppIntro)} target="_blank" rel="noreferrer">Quero receber novidades <span aria-hidden="true">↗</span></a></div>
      </section>

      <footer className="site-footer section-shell"><a className="brand" href="#inicio">{settings.store_name}</a><p>{settings.tagline}</p><a href={whatsappUrl(settings.whatsapp_number, "Olá! Gostaria de falar com a loja.")} target="_blank" rel="noreferrer">Falar no WhatsApp ↗</a><small>© {new Date().getFullYear()} {settings.store_name}. Todos os direitos reservados.</small></footer>
    </main>
  );
}
