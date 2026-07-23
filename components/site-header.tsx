type SiteHeaderProps = { storeName: string };

export function SiteHeader({ storeName }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label={`Início - ${storeName}`}>{storeName}</a>
      <nav aria-label="Navegação principal">
        <a href="#colecao">Coleção</a>
        <a href="#sobre">Curadoria</a>
        <a href="#novidades">Novidades</a>
      </nav>
      <a className="header-link" href="#colecao">Ver peças <span aria-hidden="true">↘</span></a>
    </header>
  );
}
