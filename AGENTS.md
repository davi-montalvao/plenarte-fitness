# Diretrizes de Desenvolvimento para o Cursor

Estas regras devem ser seguidas durante todo o desenvolvimento deste projeto.

Quando houver conflito entre estas regras e uma instrução do usuário, siga a instrução explícita do usuário, exceto quando isso envolver riscos de segurança ou perda de dados.

## Regras Gerais

- Atue como um engenheiro de software sênior.
- Antes de alterar qualquer código, compreenda a arquitetura e a implementação existentes.
- Não crie novos arquivos, componentes, hooks, services ou bibliotecas se já existir uma solução que possa ser reutilizada.
- Mantenha o código simples, limpo, sustentável e consistente com o projeto existente.
- Não introduza abstrações ou dependências desnecessárias.
- Não altere funcionalidades que estejam fora do escopo solicitado.
- Não faça suposições sobre regras de negócio ou arquitetura. Pergunte quando algo não estiver claro.

## Qualidade do Código

- Utilize TypeScript corretamente.
- Evite `any`, exceto quando houver uma justificativa válida.
- Siga os princípios SOLID quando aplicável.
- Evite código duplicado.
- Prefira componentes e funções reutilizáveis quando houver uma necessidade real.
- Mantenha a lógica de negócio separada da lógica de interface.
- Trate os erros corretamente.
- Não esconda erros nem utilize soluções alternativas apenas para fazer a aplicação compilar.

## Segurança

- Nunca exponha secrets, tokens, senhas ou variáveis de ambiente privadas.
- Nunca coloque informações sensíveis no código executado no cliente.
- Valide os dados recebidos do cliente.
- Nunca confie na validação do frontend como mecanismo de segurança.
- A autenticação e a autorização devem ser validadas no servidor.

## Next.js / React

- Siga as boas práticas do Next.js e React.
- Utilize Server Components sempre que possível.
- Utilize `"use client"` somente quando for necessário.
- Mantenha informações e lógica sensíveis no servidor.
- Evite `useEffect`, `useMemo` e `useCallback` desnecessários.
- Evite renderizações desnecessárias.
- Mantenha os componentes focados e fáceis de manter.

## Git

- **NUNCA execute `git commit` sem autorização explícita.**
- **NUNCA execute `git push` sem autorização explícita.**
- NUNCA faça reset, exclua ou descarte alterações do usuário sem autorização explícita.
- Preserve sempre as alterações locais existentes.
- Antes de realizar alterações significativas, verifique o estado atual do Git.

## Antes de Finalizar

- Revise as alterações realizadas.
- Verifique possíveis erros de TypeScript.
- Execute os testes relevantes, quando disponíveis.
- Execute o lint quando apropriado.
- Não afirme que algo foi testado se o teste não tiver sido realmente executado.
- Explique claramente o que foi alterado e o que foi validado.
