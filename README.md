# Sua Loja — vitrine de moda

Landing page em Next.js com vitrine pública e painel administrativo conectado ao Supabase.

## Rodar localmente

```bash
npm install
npm run dev
```

A página abre em `http://localhost:3000`. Sem configuração, ela mostra a demonstração com produtos e fotos temporárias.

## Conectar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No SQL Editor, execute todo o conteúdo de `supabase/schema.sql`.
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave anon do projeto.
4. Em **Authentication → Users**, crie o e-mail e a senha que a loja usará no painel.
5. Reinicie o servidor e acesse `/admin` para preencher os dados, enviar fotos e cadastrar peças.

O painel deixa a seção do Instagram escondida até que uma URL seja inserida e a opção de exibição seja ativada.

## Publicação

O projeto pode ser publicado na Vercel. Cadastre as mesmas variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas variáveis de ambiente do projeto.
