# Stack técnica

- **Linguagem:** TypeScript.
- **Framework web:** Next.js, escolhido como base popular para a aplicação.
- **Banco de dados inicial:** SQLite, conforme acordado pela equipe de engenharia.
- **Dados de cursos:** usar como referência o catálogo de ensino técnico e as matrizes curriculares do site indicado pela coordenação: https://etecsalesgomes.cps.sp.gov.br/ensino-tecnico/.
- **Conteúdo provisório:** matérias e descrições podem ser mockadas até que os dados definitivos estejam disponíveis.
- **Compatibilidade:** interface responsiva, com suporte a dispositivos móveis e navegadores modernos.
- **Persistência:** SQLite local, com tabelas para cursos, componentes curriculares e notícias.
- **Administração:** credenciais únicas fornecidas por variáveis de ambiente e sessão assinada em cookie seguro; sem cadastro público de usuários.

O banco é acessado com `better-sqlite3`. O caminho pode ser configurado por `DATABASE_PATH`. O segredo da sessão (`SESSION_SECRET`) precisa ter no mínimo 32 caracteres; em produção, o cookie de sessão também exige HTTPS. Hospedagem e armazenamento persistente ainda precisam ser definidos antes da publicação.