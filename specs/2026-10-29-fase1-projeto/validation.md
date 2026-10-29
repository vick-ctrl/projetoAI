# Validação do projeto

## Base e aplicação

- [ ] A aplicação inicia localmente sem erros.
- [ ] As verificações de tipos, lint e build configuradas no projeto passam.
- [ ] A configuração inicial permite conectar ao SQLite.
- [ ] A estrutura visual é utilizável em viewport móvel e desktop.
- [ ] Confirmar que os recursos implementados se limitam às fases F01–F04 previstas no roadmap.

## Catálogo, notícias e lançamento

- [ ] Confirmar os cursos e matrizes com a coordenação e substituir os dados demonstrativos.
- [ ] Verificar login, criação e exclusão de notícias com credenciais configuradas.
- [ ] Revisar páginas e fluxos em viewport móvel e desktop e em navegadores modernos.
- [ ] Definir hospedagem e armazenamento persistente compatíveis com SQLite antes da publicação.
- [ ] Publicar somente após as verificações acima.

## Evidências para merge

- Registrar os comandos de validação e seus resultados. Node.js/npm não estão disponíveis no ambiente de implementação, portanto lint, verificação de tipos, build e revisão no navegador continuam pendentes.
- Anexar capturas ou descrição da revisão responsiva quando aplicável.
- Confirmar que não há segredos ou dados locais incluídos no diff.