# Node Bank

## Sobre o projeto
O **Node Bank** é uma API REST desenvolvida em Node.js que simula operações bancárias, incluindo criação de contas, depósitos, transferências e consulta de saldo.  
O projeto utiliza **Prisma ORM** com **PostgreSQL** e segue boas práticas de organização e documentação via **Swagger**.

## Tecnologias utilizadas
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Docker & Docker Compose
- Swagger
- Jest (testes automatizados)
  

## Como executar o projeto

### Pré-requisitos
- **Node.js** >= 18
- **npm** >= 9
- **Docker** e **Docker Compose** instalados


### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/node-bank.git
cd node-bank
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Suba os containers do banco de dados
```bash
docker compose up -d
```

### 4. Gere o client do Prisma (ORM)
```bash
npx prisma generate
```

### 5. Crie as tabelas no banco
```bash
npx prisma db push
```

### 6. Inicie a aplicação
```bash
npm run dev
```

## Acesso à aplicação

A aplicação estará disponível em:  
[http://localhost:8080](http://localhost:8080)

### Acesse a documentação Swagger
[http://localhost:8080/swagger](http://localhost:8080/swagger)

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o conteúdo:

```env
PORT=8080
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"
JWT_SECRET=secret
```

---

## Sugestão de Arquitetura em Cloud (AWS) para cerca de 5k de acessos simultâneos

Abaixo apresento duas propostas de arquitetura para suportar diferentes cenários de carga, considerando boas práticas de escalabilidade, alta disponibilidade e segurança na AWS.

---

### Arquitetura para picos de acesso de **5k simultâneos**

![Arquitetura 5k Simultâneos](./docs/arquitetura-5k-simultaneos.drawio.png)

Essa arquitetura é indicada para aplicações que recebem picos de tráfego esporádicos, garantindo elasticidade automática e resiliência.

---

### Arquitetura para alta volumetria de acessos (**ex: 5k requisições/segundo**)

![Arquitetura Alta Volumetria](./docs/arquitetura-alta-volumetria.drawio.png)

Essa arquitetura é recomendada para workloads críticos e de grande escala, com alto throughput e necessidade de baixa latência.

---