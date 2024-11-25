# Projeto de TCC - Desenvolvimento de Dashboard para Instituição de Saúde de Maracaí

Este projeto de Trabalho de Conclusão de Curso (TCC) tem como objetivo o desenvolvimento de um **dashboard administrativo** para uma instituição de saúde localizada em Maracaí. O projeto é uma iniciativa do curso técnico da **Etec Pedro D'Arcádia Neto**, e foi proposto como parte das exigências curriculares para a conclusão do curso.

Nosso objetivo principal é criar uma plataforma de administração eficiente, moderna e acessível, que facilite a gestão interna da instituição de saúde. O dashboard será utilizado para gerenciar informações do hospital como dados de notícias e lista de médicos com horários de plantão, tudo de maneira dinâmica e centralizada.

---

## Estrutura do Projeto

### Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias e ferramentas:
- **Next.js**: Para o desenvolvimento do front-end e back-end.
- **Prisma**: Para o gerenciamento do banco de dados.
- **Supabase**: Como backend e serviço de banco de dados.
- **React**: Para construção de componentes reutilizáveis.
- **PNPM**: Para gerenciamento de pacotes, com suporte a alternativas como `npm`.
- **Node.js**: Para rodar o ambiente de desenvolvimento.
- **AuthJS**: Para autenticação de usuários, garantindo segurança no acesso ao dashboard.

---

### Funcionalidades Principais

- **Notícias**: Integração com o banco de dados para permitir a publicação e visualização de notícias atualizadas.
- **Equipe Médica**: Listagem e gerenciamento dos médicos da instituição, com informações de horários obtidas do banco de dados.
- **Dashboard Administrativo**: Interface administrativa para gerenciar e monitorar usuários, notícias e médicos cadastrados.
- **Responsividade**: Layout adaptável para dispositivos móveis, tablets e desktops.
- **Acessibilidade**: Seguindo boas práticas para garantir que o sistema seja inclusivo para todos os usuários.
- **Autenticação Segura**: Acesso ao dashboard restrito a usuários autenticados, usando AuthJS para gerenciar sessões e segurança.
- **Controle de Acesso por Roles**: Sistema de roles para definir permissões de acesso no dashboard. As roles são:
  - **Root**: Acesso completo a todas as funcionalidades e configurações do sistema.
  - **Admin**: Acesso à gestão de médicos, notícias e usuários.
  - **Journalist**: Acesso limitado à criação e edição de notícias, com permissões restritas a conteúdo.


---

## Configuração e Início do Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento do projeto:

### 1. Instale as dependências do projeto
```bash
pnpm install
# ou, se preferir:
npm install
```
### 2. Configure o Prisma
```bash
npx prisma generate
```

### 3. Configure o AuthJS Secret
```bash
npx auth secret
```

### 4. Configure as Variáveis de Ambiente
```bash
DATABASE_URL="postgresql://username:password@invalid-host:1234/invalid-db"
NEXT_PUBLIC_SUPABASE_URL="https://invalid-url.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IkpVY2lXbDBZYVNTV0hQb3BzYWIyZG8iLCJyb2xlIjoiY2xpZW50IiwiYWF0IjoxNjk3MzYyMDk2LCJleHAiOjE4OTcxNjI3OTZ9.invalid-key"
```

### 5. Inicie o servidor de desenvolvimento
```bash
pnpm run dev
# ou, se preferir:
npm run dev
```

### 6. Acesse o site no navegador
Abra o navegador e digite http://localhost:3000 para visualizar o projeto.