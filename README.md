# Personal Finance App

## Sumário

-   [Tecnologias Utilizadas](#tecnologias-utilizadas)
-   [Pré-requisitos](#pré-requisitos)
-   [Estrutura do Projeto](#estrutura-do-projeto)
-   [Configuração do Banco de Dados com Docker (Recomendado)](#configuração-do-banco-de-dados-com-docker-recomendado)
-   [Configuração do Frontend](#configuração-do-frontend)
-   [Configuração do Backend (PersonalFinanceAPI)](#configuração-do-backend-personalfinanceapi)
-   [Scripts Disponíveis](#scripts-disponíveis)
    -   [Frontend (`frontend/`)](#frontend-frontend)
    -   [Backend (`PersonalFinanceAPI/`)](#backend-personalfinanceapi)

Este documento fornece um guia completo para configurar e executar o Personal Finance App, uma aplicação web projetada para ajudar os usuários a gerenciar suas finanças pessoais, rastreando contas e transações. A aplicação é composta por um frontend desenvolvido em React e um backend API construído com Node.js e Express, utilizando PostgreSQL como banco de dados.

Esta documentação cobre os pré-requisitos, tecnologias utilizadas, estrutura do projeto, configuração do banco de dados (incluindo o uso de Docker), e instruções detalhadas para configurar e executar tanto o frontend quanto o backend, além de uma lista dos scripts NPM/PNPM disponíveis.

## Tecnologias Utilizadas

O Personal Finance App utiliza um conjunto moderno de tecnologias para oferecer uma experiência robusta e eficiente:

**Frontend:**
-   **React 19.x:** Biblioteca JavaScript para construir interfaces de usuário.
-   **Vite:** Ferramenta de build e servidor de desenvolvimento rápido para projetos frontend modernos.
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
-   **Tailwind CSS:** Framework CSS utility-first para estilização rápida.
-   **Axios:** Cliente HTTP baseado em Promises para realizar requisições à API.
-   **React Router DOM:** Para gerenciamento de rotas no lado do cliente.
-   **React Hook Form:** Para gerenciamento de formulários.
-   **ESLint & Prettier:** Para linting e formatação de código, garantindo consistência e qualidade.

**Backend (PersonalFinanceAPI):**
-   **Node.js (v18.x+):** Ambiente de execução JavaScript no lado do servidor.
-   **Express.js:** Framework minimalista e flexível para Node.js, usado para construir a API.
-   **TypeScript:** Para desenvolvimento com tipagem estática no backend.
-   **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional objeto.
-   **TypeORM:** ORM (Object-Relational Mapper) para TypeScript e JavaScript, facilitando a interação com o banco de dados.
-   **JWT (JSON Web Tokens):** Para autenticação e autorização baseadas em token (`jsonwebtoken`).
-   **Bcrypt:** Para hashing de senhas.
-   **Jest & Supertest:** Para testes unitários e de integração da API.
-   **ESLint & Prettier:** Para linting e formatação de código.
-   **ts-node-dev:** Para desenvolvimento com reinício automático e compilação de TypeScript em tempo real.
-   **Dotenv:** Para carregar variáveis de ambiente de um arquivo `.env`.

**Geral & Ferramentas:**
-   **pnpm (v10.4.1+):** Gerenciador de pacotes rápido e eficiente em disco.
-   **Docker & Docker Compose:** Para containerização e orquestração de serviços, facilitando a configuração do ambiente de banco de dados.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

-   **Node.js**: Versão 18.x ou posterior é recomendada.
-   **pnpm**: Versão 10.4.1 ou posterior (conforme especificado no `package.json` do backend). Você pode instalar o pnpm globalmente via npm: `npm install -g pnpm`.
-   **PostgreSQL**: Uma instância em execução do banco de dados PostgreSQL.
    -   **Alternativa com Docker:** Se você tem Docker e Docker Compose instalados, pode pular a instalação manual do PostgreSQL e usar o arquivo `docker-compose.yml` fornecido no backend para configurar os bancos de dados. Veja a seção "[Configuração do Banco de Dados com Docker (Recomendado)](#configuração-do-banco-de-dados-com-docker-recomendado)".
-   **Docker e Docker Compose (Opcional, mas Recomendado):** Para usar a configuração de banco de dados via Docker.

## Estrutura do Projeto

O projeto reside dentro de uma estrutura de pastas principal, aqui denominada `techlab/` para fins ilustrativos. A organização dos arquivos e diretórios é a seguinte:

```
techlab/
├── PersonalFinanceAPI/
│   ├── .editorconfig
│   ├── .env                # (Criado pelo usuário, não versionado)
│   ├── .env.example
│   ├── .env.test.local     # (Pode ser usado para overrides de teste locais)
│   ├── .prettierrc
│   ├── coverage/           # (Gerado por testes de cobertura)
│   ├── data/               # (Dados persistidos do Docker, se configurado localmente)
│   │   ├── finance/
│   │   └── test/
│   ├── docker-compose.yml
│   ├── eslint.config.js
│   ├── jest.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   ├── src/                # (Código-fonte do backend)
│   │   └── ...
│   └── README.md           # (README específico do backend)
│
├── frontend/
│   ├── .prettierignore
│   ├── .prettierrc.json
│   ├── components.json     # (Possivelmente para Shadcn/ui ou similar)
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── public/             # (Arquivos estáticos públicos)
│   ├── README.md           # (README específico do frontend)
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .vscode/            # (Configurações do VSCode para o projeto)
│   │   └── ...
│   └── src/                # (Código-fonte do frontend)
│       └── ...
│
└── README.md               # (README principal do projeto/monorepo)
```

**Principais Diretórios:**

-   `PersonalFinanceAPI/`: Contém a API backend em Node.js, incluindo o `docker-compose.yml` para os serviços de banco de dados.
-   `frontend/`: Contém a aplicação frontend em React.

## Configuração do Banco de Dados com Docker (Recomendado)

Para simplificar a configuração do PostgreSQL para desenvolvimento e testes, você pode usar o Docker Compose. O arquivo `docker-compose.yml` está localizado no diretório `PersonalFinanceAPI/`.

1.  **Navegue até o diretório do backend:**
    ```bash
    cd PersonalFinanceAPI
    ```

2.  **Certifique-se de que as variáveis de ambiente para o Docker Compose estejam definidas (opcional):**
    O `docker-compose.yml` utiliza variáveis como `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`, `${POSTGRES_DB_FINANCE}`, e `${POSTGRES_DB_TEST}`. Estas variáveis devem ser definidas no seu ambiente ou em um arquivo `.env` na raiz de `PersonalFinanceAPI/` para que o Docker Compose as utilize. Por exemplo, o seu arquivo `PersonalFinanceAPI/.env` (detalhado na seção "[Configuração do Backend (PersonalFinanceAPI)](#configuração-do-backend-personalfinanceapi)") já conterá definições que podem ser usadas:
    ```env
    # Exemplo de variáveis relevantes do PersonalFinanceAPI/.env
    POSTGRES_USER=user
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB_FINANCE=app_db
    POSTGRES_DB_TEST=app_db_test
    ```
    O `docker-compose.yml` está configurado para usar esses nomes de variáveis para popular as configurações dos containers PostgreSQL.

3.  **Inicie os contêineres do PostgreSQL:**
    ```bash
    docker-compose up -d
    ```
    Este comando irá iniciar dois serviços PostgreSQL:
    -   `postgres_finance`: Banco de dados principal, acessível em `localhost:5434`.
    -   `postgres_test`: Banco de dados para testes, acessível em `localhost:5433`.

    Os dados serão persistidos em volumes locais dentro de `PersonalFinanceAPI/data/`.

4.  **Para parar os contêineres:**
    ```bash
    docker-compose down
    ```

Com os bancos de dados rodando via Docker, você pode prosseguir para a configuração do backend, garantindo que as variáveis no arquivo `.env` da API correspondam às configurações do Docker.

## Configuração do Frontend

Siga estes passos para configurar e executar o frontend:

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend
    # ou cd ../frontend se estiver em PersonalFinanceAPI/
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    pnpm run dev
    ```
    A aplicação frontend estará normalmente disponível em `http://localhost:5173` (porta padrão do Vite).

## Configuração do Backend (PersonalFinanceAPI)

Siga estes passos para configurar e executar a API backend:

1.  **Navegue até o diretório do backend:**
    ```bash
    cd PersonalFinanceAPI
    # ou cd ../PersonalFinanceAPI se estiver em frontend/
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` no diretório `PersonalFinanceAPI/`. Você pode copiar o conteúdo do arquivo `PersonalFinanceAPI/.env.example` e modificá-lo, ou usar o exemplo abaixo, substituindo os valores de placeholder pela sua configuração real.

    ```env
    # Server Configuration
    PORT=3001
    NODE_ENV=development # 'development', 'production', ou 'test'

    # PostgreSQL Configuration for Main Database (postgres_finance)
    # Estas variáveis devem corresponder às usadas no docker-compose.yml se estiver usando Docker,
    # ou à sua configuração de PostgreSQL local/remoto.
    POSTGRES_USER=user
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB_FINANCE=app_db
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5434 # Porta para o serviço postgres_finance (Docker) ou sua instância PostgreSQL

    # PostgreSQL Configuration for Test Database (postgres_test)
    # Usado pelos scripts de teste.
    POSTGRES_USER_TEST=user
    POSTGRES_PASSWORD_TEST=postgres
    POSTGRES_DB_TEST=app_db_test
    POSTGRES_HOST_TEST=localhost
    POSTGRES_PORT_TEST=5433 # Porta para o serviço postgres_test (Docker) ou sua instância PostgreSQL de teste

    # Full Database URLs (a aplicação usará estas URLs)
    # A DATABASE_URL é usada pela aplicação principal.
    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB_FINANCE}"

    # A DATABASE_URL_TEST é usada pelos scripts de teste (ex: Jest).
    DATABASE_URL_TEST="postgresql://${POSTGRES_USER_TEST}:${POSTGRES_PASSWORD_TEST}@${POSTGRES_HOST_TEST}:${POSTGRES_PORT_TEST}/${POSTGRES_DB_TEST}"

    # JWT Secret Key
    # Substitua por uma chave secreta forte e única para produção!
    JWT_SECRET="sua_chave_jwt_muito_forte_e_secreta_aqui"
    ```

    **Notas sobre as variáveis de ambiente:**
    -   `PORT`: Porta onde o servidor backend será executado. `3001` é sugerido para evitar conflito com o frontend.
    -   `NODE_ENV`: Define o ambiente da aplicação.
    -   `POSTGRES_*`: Credenciais e detalhes de conexão para seus bancos de dados PostgreSQL.
        -   Se estiver usando o Docker Compose conforme descrito acima, `POSTGRES_HOST` será `localhost`, `POSTGRES_PORT` será `5434` para o banco principal, e `POSTGRES_PORT_TEST` será `5433` para o banco de testes.
        -   `POSTGRES_DB_FINANCE` é o nome do banco de dados principal.
        -   `POSTGRES_DB_TEST` é o nome do banco de dados usado para executar os testes automatizados.
    -   `DATABASE_URL`: String de conexão completa para o banco de dados principal, construída a partir das variáveis `POSTGRES_*`.
    -   `DATABASE_URL_TEST`: String de conexão completa para o banco de dados de teste.
    -   `JWT_SECRET`: Uma chave secreta forte e única usada para assinar e verificar JSON Web Tokens (JWTs) para autenticação.

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    pnpm run dev
    ```
    A API backend estará normalmente disponível em `http://localhost:3001` (ou a porta que você especificou no arquivo `.env`).

## Scripts Disponíveis

### Frontend (`frontend/`)

-   `pnpm run dev`: Inicia o servidor de desenvolvimento usando Vite.
-   `pnpm run build`: Compila o TypeScript e a aplicação React para produção (os arquivos compilados estarão geralmente em `dist/`).
-   `pnpm run lint`: Executa o ESLint para analisar o código em busca de problemas (`eslint . --ext .js,.jsx,.ts,.tsx`).
-   `pnpm run format`: Formata o código usando Prettier (`prettier --write .`).
-   `pnpm run check`: Executa tanto o linting (`pnpm run lint`) quanto a formatação (`pnpm run format`).
-   `pnpm run preview`: Serve a build de produção localmente para visualização.

### Backend (`PersonalFinanceAPI/`)

-   `pnpm run dev`: Inicia o servidor de desenvolvimento usando `ts-node-dev` (compilação TypeScript em tempo real e reinício automático).
-   `pnpm run build`: Compila o código TypeScript para JavaScript (saída geralmente em `dist/`).
-   `pnpm run start`: Inicia a aplicação a partir do código JavaScript compilado (para uso em produção, após `pnpm run build`).
-   `pnpm run lint`: Executa o ESLint para analisar o código (`eslint .`).
-   `pnpm run format`: Formata o código usando Prettier (`prettier --write .`).
-   `pnpm run test`: Executa os testes unitários e de integração usando Jest. Configura `NODE_ENV=test` e executa os testes sequencialmente (`cross-env NODE_ENV=test jest --runInBand`).
-   `pnpm run test:coverage`: Executa os testes com Jest e gera um relatório de cobertura de código.
-   `pnpm run check`: Executa tanto o linting (`pnpm run lint`) quanto a formatação (`pnpm run format`).
