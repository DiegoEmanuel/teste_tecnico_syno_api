# Projeto - API com Upload de Imagens e Autenticação
 - [Frontend SYNO](https://github.com/DiegoEmanuel/teste_tecnico_syno/).

Este projeto utiliza **Node.js**, **Express**, **Prisma** e **PostgreSQL** para gerenciar usuários, produtos e upload de imagens.

## Sumário

1. [Configurações Iniciais](#configurações-iniciais)
2. [Instalação](#instalação)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Uso](#uso)
6. [Endpoints Principais](#endpoints-principais)
   - [Usuários](#usuários)
   - [Produtos](#produtos)
7. [Autenticação](#autenticação)
8. [Uploads de Imagens](#uploads-de-imagens)
9. [Migrations (Prisma)](#migrations-prisma)
10. [Outras Observações](#outras-observações)

---

## Configurações Iniciais

- **Node.js** (>= 14)
- **PostgreSQL** instalado e rodando
- Criação de um banco de dados para o projeto
- Ajustar as variáveis de ambiente, especialmente `DATABASE_URL`
- Ajustar variáveis do firebase `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_STORAGE_BUCKET`
---

## Instalação

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. **Instalar dependências**:
   ```bash
   npm install
   ```
3. **Configurar as variáveis de ambiente** (ver seção [Variáveis de Ambiente](#variáveis-de-ambiente)).

4. **Rodar migrations** (ver seção [Migrations (Prisma)](#migrations-prisma)).

---

## Estrutura de Pastas

```
.
├── prisma
│   ├── schema.prisma         // Definição do banco de dados usando Prisma
├── src
│   ├── config
│   │   └── multerconfig.ts   // Configurações do Multer para upload de imagens
│   ├── database
│   │   └── index.ts          // Inicialização do Prisma
│   ├── helper
│   │   └── url_helper.ts     // Função para construir a URL da imagem
│   ├── modules
│   │   ├── auth
│   │   │   └── auth_controller.ts
│   │   │   └── auth.controller.test.ts
│   │   │   ├── dtos
│   │   │   │   └── login.dto.ts
│   │   ├── users
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.service.ts
│   │   ├── products
│   │   │   ├── product.controller.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── product.service.ts
│   └── server.ts             // Configuração principal do servidor
│   └── routes
│   │   ├── index.ts
│   └── server.ts             // Configuração principal do servidor
├── uploads
│   └── products              // Pasta onde as imagens são salvas
└── ...
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as chaves necessárias:

```
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco
PORT=3000
# Se houver JWT_SECRET ou outras variáveis, adicione-as aqui
```

- **DATABASE_URL**: String de conexão com o banco PostgreSQL, no formato:
  `postgresql://usuario:senha@hostname:5432/nome_do_banco`
- **PORT**: Porta em que o servidor será iniciado. (Padrão: `3000`)

---

## Uso

1. **Iniciar servidor em modo desenvolvimento**:
   ```bash
   npm run dev
   ```
2. **Iniciar servidor em modo produção**:
   ```bash
   npm run build
   npm run start
   ```
3. Acesse em:  
   ```
   http://localhost:3000
   ```

---

## Endpoints Principais

### Usuários

- **POST** `/users` — Cria um usuário
- **POST** `/users/login` — Faz o login (gera token)
- **GET** `/users` — Lista todos os usuários
- **GET** `/users/:id` — Detalhes de um usuário específico
- **PUT** `/users/:id` — Atualiza dados de um usuário
- **DELETE** `/users/:id` — Deleta um usuário

### Produtos

- **POST** `/products`  
  *Criação de produto*  
  - Enviar no Body:  
    - `codigo_produto` (string)  
    - `descricao_produto` (string)  
    - `foto_produto` (file) — *campo do tipo file (multipart/form-data)*  
- **GET** `/products` — Lista todos os produtos  
- **GET** `/products/:id` — Detalhes de um produto  
- **PUT** `/products/:id` — Atualizar dados de um produto (pode enviar novamente a imagem)  
- **DELETE** `/products/:id` — Deleta um produto  
- **DELETE** `/products` — Deleta todos os produtos  

---

## Autenticação

- A maioria dos endpoints requer um **Bearer Token** no header `Authorization`.  
- O Token é retornado no login de **Users** em:  
  ```http
  POST /users/login
  ```

---

## Uploads de Imagens

- Utiliza-se o **Multer** configurado em `src/config/multerconfig.ts`
- As imagens são salvas na pasta `uploads/products`
- Para enviar uma imagem, defina **form-data** no Postman, com o campo `foto_produto` do tipo **File**.

---

## Migrations (Prisma)

Para criar ou atualizar o banco de dados, use:

```bash
# Criar uma nova migration
npx prisma migrate dev --name <nome_da_migracao>

# Gerar o Prisma Client
npx prisma generate
```

---

## Outras Observações

- Caso deseje alterar o comportamento de cache, configure manualmente no `server.ts`.
- As rotas de imagens estão liberadas pelo firebase
  ```
  GET https://firebasestorage.googleapis.com/v0/b/syno-2bc76.firebasestorage.app/o/20250218T011455197Z_66486a2a5e3bf31fb267b07a7793e7d9.jpg?alt=media
  ```
  Aws:
  ```
  http://34.205.99.179:3000
  ```

**FIM**
