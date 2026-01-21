# Brevly - Encurtador de URLs

Brevly é uma aplicação full-stack para encurtamento de URLs, composta por uma API backend em Node.js e uma interface web em React.

## Tecnologias Utilizadas

### Backend (Server)
- Node.js 22
- Fastify
- PostgreSQL
- Drizzle ORM
- TypeScript
- Zod (validação)
- Cloudflare R2 (armazenamento)

### Frontend (Web)
- React 19
- TypeScript
- Vite
- TailwindCSS
- TanStack Router
- TanStack Query
- Axios

## Pré-requisitos

- [Node.js](https://nodejs.org/) v22 ou superior
- [pnpm](https://pnpm.io/) v10.24.0 ou superior
- [Docker](https://www.docker.com/) e Docker Compose (opcional, para banco de dados ou deploy)

## Estrutura do Projeto

```
brevly/
├── server/          # API Backend
│   ├── src/
│   │   ├── http/    # Rotas e servidor
│   │   └── infra/   # Banco de dados e storage
│   └── Dockerfile
├── web/             # Frontend React
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── routes/
└── package.json     # Workspace root
```

## Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd brevly
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Copie os arquivos de exemplo e configure as variáveis:

```bash
# Backend
cp server/.env.example server/.env

# Frontend
cp web/.env.example web/.env
```

Edite os arquivos `.env` com suas configurações.

#### Variáveis do Backend (server/.env)

```env
# Banco de dados PostgreSQL
DATABASE_URL=postgresql://docker:docker@localhost:5432/brevly

# Configuração do servidor
PORT=3333

# URL da aplicação web (para CORS e redirecionamentos)
WEB_APP_URL=http://localhost:5173

# Cloudflare R2 (para exportação CSV)
CLOUDFLARE_ACCOUNT_ID=seu-account-id
CLOUDFLARE_ACCESS_KEY_ID=sua-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=sua-secret-key
CLOUDFLARE_BUCKET=nome-do-bucket
CLOUDFLARE_PUBLIC_URL=https://seu-bucket.r2.dev
```

#### Variáveis do Frontend (web/.env)

```env
# URL base da API
VITE_API_BASE_URL=http://localhost:3333

# URL da própria aplicação web
VITE_APP_URL=http://localhost:5173
```

## Executando com Docker

### Subir apenas o banco de dados

Execute a partir da pasta `server/`:

```bash
cd server
docker compose up -d
```

Isso irá iniciar um container PostgreSQL na porta 5432.

### Build da imagem da API

**Importante:** O comando deve ser executado a partir da **raiz do projeto** (pasta `brevly/`):

```bash
# Na raiz do projeto (brevly/)
docker build -t brevly-api:latest -f server/Dockerfile .
```

### Executar o container da API

```bash
docker run -d \
  -p 3333:3333 \
  --env-file server/.env \
  --name brevly-api \
  brevly-api:latest
```

### Comandos Docker úteis

```bash
# Ver logs do container
docker logs brevly-api

# Parar o container
docker stop brevly-api

# Remover o container
docker rm brevly-api

# Rebuild da imagem (após alterações no código)
docker build -t brevly-api:latest -f server/Dockerfile . --no-cache
```

## Executando Localmente (Desenvolvimento)

### 1. Iniciar o banco de dados

```bash
cd server
docker compose up -d
```

### 2. Executar as migrations

```bash
cd server
pnpm db:migrate
```

### 3. Iniciar o servidor de desenvolvimento

Em terminais separados:

```bash
# Terminal 1 - Backend
cd server
pnpm dev
```

```bash
# Terminal 2 - Frontend
cd web
pnpm dev
```

O backend estará disponível em `http://localhost:3333` e o frontend em `http://localhost:5173`.

## Scripts Disponíveis

### Backend (server/)

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor em modo desenvolvimento com hot reload |
| `pnpm build` | Compila o TypeScript para JavaScript |
| `pnpm start` | Inicia o servidor compilado (produção) |
| `pnpm db:generate` | Gera novas migrations baseadas nas alterações do schema |
| `pnpm db:migrate` | Executa as migrations pendentes |
| `pnpm db:studio` | Abre o Drizzle Studio para visualizar o banco de dados |

### Frontend (web/)

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento Vite |
| `pnpm build` | Compila a aplicação para produção |
| `pnpm preview` | Visualiza o build de produção localmente |
| `pnpm lint` | Executa o linter |

## Documentação da API

A documentação da API está disponível via Swagger/Scalar em:

```
http://localhost:3333/docs
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/links` | Cria um novo link encurtado |
| GET | `/links` | Lista todos os links |
| DELETE | `/links/:id` | Remove um link |
| GET | `/:code` | Redireciona para a URL original |
| GET | `/links/export` | Exporta links em CSV |

## Banco de Dados

O projeto utiliza PostgreSQL com Drizzle ORM. As migrations estão localizadas em:

```
server/src/infra/db/migrations/
```

### Acessar o banco via Drizzle Studio

```bash
cd server
pnpm db:studio
```

## Troubleshooting

### Erro ao buildar Docker: "server/package.json not found"

Certifique-se de executar o comando `docker build` a partir da **raiz do projeto** (pasta `brevly/`), não de dentro da pasta `server/`.

```bash
# Correto (na raiz do projeto)
docker build -t brevly-api:latest -f server/Dockerfile .

# Incorreto (dentro de server/)
docker build -t brevly-api:latest .
```

### Erro de conexão com banco de dados

Verifique se o container do PostgreSQL está rodando:

```bash
docker ps
```

Se não estiver, inicie-o:

```bash
cd server
docker compose up -d
```

### Porta já em uso

Se a porta 3333 ou 5432 já estiver em uso, você pode:

1. Parar o processo que está usando a porta
2. Ou alterar a porta no arquivo `.env` e `docker-compose.yml`

## Licença

ISC
