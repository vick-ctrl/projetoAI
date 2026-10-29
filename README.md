# Sitech

Site institucional responsivo para apresentar cursos técnicos e notícias da comunidade. Construído com Next.js, TypeScript e SQLite.

## Requisitos

- Node.js 20.9 ou superior.
- npm.

## Executar localmente

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env.local` e defina `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `SESSION_SECRET`. Use uma senha única e um segredo aleatório com pelo menos 32 caracteres. Gere um segredo com `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
3. Execute `npm run dev` e acesse `http://localhost:3000`.

O SQLite é criado automaticamente em `data/sitech.sqlite` na primeira execução. Defina `DATABASE_PATH` para usar outro caminho. A pasta de dados e os arquivos de ambiente são ignorados pelo Git.

## Funcionalidades

- Página inicial, catálogo de cursos e matrizes curriculares demonstrativas.
- Notícias públicas na página inicial e na seção de notícias.
- Área administrativa em `/admin/login` para publicar e excluir notícias.
- Sessões administrativas assinadas, em cookie `HttpOnly`, `SameSite=Strict`, com validade de oito horas.

Os cursos e componentes curriculares iniciais são dados demonstrativos porque o site de referência da coordenação não estava acessível durante a implementação. Confirme e substitua os dados de exemplo em `src/lib/db.ts` antes de divulgar o catálogo como oficial.

## Verificações

```powershell
npm run typecheck
npm run lint
npm run build
```

## Implantação

O banco SQLite precisa de armazenamento persistente e gravável. Em hospedagens com sistema de arquivos efêmero ou múltiplas instâncias, configure armazenamento persistente compatível antes de publicar; a hospedagem e o domínio ainda precisam ser definidos.
