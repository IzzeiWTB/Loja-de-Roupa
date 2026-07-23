"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";
import { demoSettings } from "@/lib/demo-data";
import type { Category, InstagramItem, Product, StoreSettings } from "@/lib/types";
import "./admin.css";

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabase = configured ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) : null;

type ProductDraft = Omit<Product, "price" | "id"> & { id?: string; price: string };
const freshProduct = (): ProductDraft => ({ name: "", category: "Feminino", description: "", image_urls: [], price: "", show_price: false, published: true, featured: false, display_order: 0, whatsapp_message: null });

function toDraft(product: Product): ProductDraft { return { ...product, price: product.price?.toString() || "" }; }

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [settings, setSettings] = useState<StoreSettings>(demoSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [instagramItems, setInstagramItems] = useState<InstagramItem[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(freshProduct());
  const [login, setLogin] = useState({ email: "", password: "" });

  const publicUrl = useMemo(() => (typeof window === "undefined" ? "/" : window.location.origin), []);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); if (data.user) loadContent(); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadContent();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadContent() {
    if (!supabase) return;
    const [settingsResult, productsResult, instagramResult] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", true).single(),
      supabase.from("products").select("*").order("display_order"),
      supabase.from("instagram_items").select("*").order("display_order"),
    ]);
    if (settingsResult.data) setSettings(settingsResult.data as StoreSettings);
    if (productsResult.data) setProducts(productsResult.data as Product[]);
    if (instagramResult.data) setInstagramItems(instagramResult.data as InstagramItem[]);
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword(login);
    setNotice(error ? error.message : "Login realizado.");
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.from("site_settings").upsert({ ...settings, id: true });
    setNotice(error ? error.message : "Informações da loja salvas.");
  }

  async function uploadProductImage(file?: File) {
    if (!supabase || !file) return;
    setNotice("Enviando imagem...");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (error) { setNotice(error.message); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setDraft((current) => ({ ...current, image_urls: [...current.image_urls, data.publicUrl] }));
    setNotice("Imagem enviada. Salve o produto para publicar.");
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !draft.name || draft.image_urls.length === 0) { setNotice("Informe nome e ao menos uma foto."); return; }
    const payload = { ...draft, price: draft.show_price && draft.price ? Number(draft.price.replace(",", ".")) : null, display_order: draft.display_order || products.length + 1 };
    const { id, ...data } = payload;
    const result = id ? await supabase.from("products").update(data).eq("id", id) : await supabase.from("products").insert(data);
    setNotice(result.error ? result.error.message : "Produto salvo.");
    if (!result.error) { setDraft(freshProduct()); await loadContent(); }
  }

  async function deleteProduct(id: string) {
    if (!supabase || !confirm("Remover este produto da vitrine?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    setNotice(error ? error.message : "Produto removido.");
    if (!error) loadContent();
  }

  async function togglePublication(product: Product) {
    if (!supabase) return;
    const { error } = await supabase.from("products").update({ published: !product.published }).eq("id", product.id);
    setNotice(error ? error.message : product.published ? "Produto ocultado." : "Produto publicado.");
    if (!error) loadContent();
  }

  async function addInstagramItem() {
    if (!supabase) return;
    const imageUrl = prompt("Cole a URL da imagem do post:");
    if (!imageUrl) return;
    const postUrl = prompt("Cole a URL do post (opcional):") || null;
    const { error } = await supabase.from("instagram_items").insert({ image_url: imageUrl, post_url: postUrl, alt_text: "Post da loja no Instagram", display_order: instagramItems.length + 1 });
    setNotice(error ? error.message : "Post adicionado.");
    if (!error) loadContent();
  }

  async function removeInstagramItem(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from("instagram_items").delete().eq("id", id);
    setNotice(error ? error.message : "Post removido.");
    if (!error) loadContent();
  }

  if (!configured) return <SetupGuide />;
  if (loading) return <div className="admin-loading">Carregando painel...</div>;
  if (!user) return <Login login={login} setLogin={setLogin} signIn={signIn} notice={notice} />;

  return <main className="admin-shell">
    <header className="admin-header"><a href="/">← Ver vitrine</a><div><span>Olá, {user.email}</span><button onClick={() => supabase?.auth.signOut()}>Sair</button></div></header>
    <div className="admin-intro"><p className="admin-kicker">Painel da loja</p><h1>Cuide da sua vitrine.</h1><p>Altere produtos, fotos e informações sem mexer em código.</p>{notice && <div className="notice" role="status">{notice}</div>}</div>

    <section className="admin-section"><div className="admin-section-title"><p className="admin-kicker">01 — Informações</p><h2>A identidade da loja</h2></div>
      <form className="admin-form settings-form" onSubmit={saveSettings}>
        <label>Nome da loja<input value={settings.store_name} onChange={(e) => setSettings({ ...settings, store_name: e.target.value })} required /></label>
        <label>WhatsApp (com DDI e DDD)<input value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} placeholder="5511999999999" required /></label>
        <label className="full">Frase curta no rodapé<input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} /></label>
        <label className="full">Título principal<input value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} /></label>
        <label className="full">Texto principal<textarea value={settings.hero_text} onChange={(e) => setSettings({ ...settings, hero_text: e.target.value })} rows={3} /></label>
        <label className="full">URL da imagem principal<input type="url" value={settings.hero_image_url} onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })} /></label>
        <label>URL do Instagram<input type="url" value={settings.instagram_url || ""} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value || null })} placeholder="https://instagram.com/..." /></label>
        <label className="check-label"><input type="checkbox" checked={settings.instagram_enabled} onChange={(e) => setSettings({ ...settings, instagram_enabled: e.target.checked })} /> Exibir seção Instagram</label>
        <button className="admin-button" type="submit">Salvar informações</button>
      </form>
    </section>

    <section className="admin-section"><div className="admin-section-title"><p className="admin-kicker">02 — Produtos</p><h2>{draft.id ? "Editar peça" : "Adicionar nova peça"}</h2></div>
      <form className="admin-form product-form" onSubmit={saveProduct}>
        <label>Nome da peça<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required /></label>
        <label>Categoria<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}><option>Feminino</option><option>Masculino</option></select></label>
        <label className="full">Descrição<textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2} required /></label>
        <label className="full">Mensagem para WhatsApp (opcional)<input value={draft.whatsapp_message || ""} onChange={(e) => setDraft({ ...draft, whatsapp_message: e.target.value || null })} placeholder="Olá! Quero saber mais sobre esta peça." /></label>
        <label>Preço<input disabled={!draft.show_price} value={draft.price} inputMode="decimal" onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Ex.: 159,90" /></label>
        <label className="check-label"><input type="checkbox" checked={draft.show_price} onChange={(e) => setDraft({ ...draft, show_price: e.target.checked })} /> Mostrar preço na vitrine</label>
        <label className="check-label"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Destacar na coleção</label>
        <label className="check-label"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Publicar agora</label>
        <div className="full upload-area"><strong>Fotos da peça</strong><input type="file" accept="image/*" onChange={(e) => uploadProductImage(e.target.files?.[0])} /><div className="preview-row">{draft.image_urls.map((url) => <button type="button" className="image-preview" key={url} onClick={() => setDraft({ ...draft, image_urls: draft.image_urls.filter((image) => image !== url) })}><img src={url} alt="Prévia da peça" /><span>Remover</span></button>)}</div></div>
        <div className="form-actions"><button className="admin-button" type="submit">{draft.id ? "Salvar alterações" : "Cadastrar peça"}</button>{draft.id && <button className="admin-button secondary" type="button" onClick={() => setDraft(freshProduct())}>Cancelar edição</button>}</div>
      </form>
      <div className="admin-products">{products.length === 0 ? <p className="empty-admin">Ainda não há produtos cadastrados.</p> : products.map((product) => <article key={product.id} className="admin-product"><img src={product.image_urls[0]} alt="" /><div><p className="admin-kicker">{product.category} · {product.published ? "Publicado" : "Oculto"}</p><h3>{product.name}</h3><button onClick={() => setDraft(toDraft(product))}>Editar</button><button onClick={() => togglePublication(product)}>{product.published ? "Ocultar" : "Publicar"}</button><button className="danger" onClick={() => deleteProduct(product.id)}>Remover</button></div></article>)}</div>
    </section>

    <section className="admin-section"><div className="admin-section-title"><p className="admin-kicker">03 — Instagram</p><h2>Posts que inspiram</h2><p>Use imagens e links de posts para criar o carrossel da página inicial.</p></div><button className="admin-button" onClick={addInstagramItem}>Adicionar post</button><div className="instagram-admin-grid">{instagramItems.map((item) => <article key={item.id}><img src={item.image_url} alt={item.alt_text} /><button className="danger" onClick={() => removeInstagramItem(item.id)}>Remover</button></article>)}</div></section>
    <footer className="admin-footer">Vitrine pública: <a href={publicUrl}>{publicUrl}</a></footer>
  </main>;
}

function Login({ login, setLogin, signIn, notice }: { login: { email: string; password: string }; setLogin: (value: { email: string; password: string }) => void; signIn: (event: FormEvent) => void; notice: string }) {
  return <main className="login-shell"><form className="login-card" onSubmit={signIn}><a href="/">← Voltar para a vitrine</a><p className="admin-kicker">Área restrita</p><h1>Entrar no painel</h1><label>E-mail<input type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required /></label><label>Senha<input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required /></label>{notice && <p className="notice">{notice}</p>}<button className="admin-button" type="submit">Entrar</button></form></main>;
}

function SetupGuide() {
  return <main className="login-shell"><div className="login-card setup-guide"><a href="/">← Ver demonstração</a><p className="admin-kicker">Configuração necessária</p><h1>Conecte o Supabase.</h1><p>Copie <code>.env.example</code> para <code>.env.local</code>, preencha as chaves do projeto Supabase e execute o arquivo <code>supabase/schema.sql</code> no SQL Editor.</p><p>Depois crie o usuário da loja em <strong>Authentication → Users</strong>. O painel estará pronto para cadastrar peças e fotos.</p></div></main>;
}
