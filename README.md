# ANMAR25_D01_COMPASSCAR
Desafio 1 - Compass CAR, API Node para um sistema de locação de carros.

# CARSAPI - Node.js

Esta é uma API REST para gerenciamento de carros, desenvolvida com Node.js, Express e MySQL com Sequelize. A aplicação implementa operações CRUD (Create, Read, Update, Delete) completas para um sistema de cadastro de veículos.

## Tecnologias utilizadas

- Node.js
- Express.js
- MySQL
- Sequelize
- Cors
- Dotenv
- ESLint
- Prettier

## Estrutura do projeto

O projeto tem uma arquitetura em camadas:

```
api-carros/
├── src/
│   ├── config/       # Configurações
│   ├── controllers/  # Controladores
│   ├── middlewares/  # Middlewares da aplicação
│   ├── models/       # Modelos do Sequelize
│   ├── repositories/ # Camada de acesso a dados
│   ├── routes/       # Definição de rotas
│   ├── services/     # Camada de serviços
│   ├── utils/        # Utilitários
│   ├── app.js        # Configuração do Express
│   └── server.js     # Ponto de entrada da aplicação
```

## Pré-requisitos

- Node.js
- MySQL
- npm ou yarn

## Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/fabioaccer/ANMAR25_D01_COMPASSCAR.git
cd ANMAR25_D01_COMPASSCAR
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=senha_mysql
DB_NAME=compasscar
NODE_ENV=development
```

Ajuste os valores conforme necessário para o seu ambiente.

## Instalação e Configuração do MySQL

### 1. Instalação do MySQL

#### Para Windows:
1. Baixe o MySQL em [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
2. Execute o instalador
3. Selecione "Developer Default"
4. Coloque uma senha para o usuário root
5. Complete a instalação seguindo os passos

#### Para macOS:
1. Usando Homebrew:
   ```bash
   brew install mysql
   brew services start mysql
   ```
2. Coloque uma senha para o usuário root:
   ```bash
   mysql_secure_installation
   ```

#### Para Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

#### Para Linux (CentOS/RHEL):
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation
```

### 2. Configuração do MySQL para a API

1. Acesse o MySQL como root:
   ```bash
   mysql -u root -p
   ```

2. Crie um usuário específico para a aplicação:
   ```sql
   CREATE USER 'compassuser'@'localhost' IDENTIFIED BY 'suasenha';
   ```

3. Crie o banco de dados para a aplicação:
   ```sql
   CREATE DATABASE compasscar;
   ```

4. Conceda privilégios ao usuário:
   ```sql
   GRANT ALL PRIVILEGES ON compasscar.* TO 'compassuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Se preferir usar o usuário root, apenas crie o banco de dados:
   ```sql
   CREATE DATABASE compasscar;
   ```

6. Atualize o arquivo `.env` com as credenciais:
   ```
   DB_HOST=localhost
   DB_USER=compassuser  # ou 'root' se estiver usando o usuário root
   DB_PASS=suasenha     # a senha definida
   DB_NAME=compasscar
   ```

### 3. Criação das tabelas

Você tem duas opções para criar as tabelas necessárias:

#### Opção 1: Criar tabelas manualmente via SQL

1. Conecte ao MySQL:
   ```bash
   mysql -u compassuser -p compasscar
   ```

2. Execute os comandos SQL para criar as tabelas:
   ```sql
   CREATE TABLE cars (
       id INT AUTO_INCREMENT PRIMARY KEY,
       brand VARCHAR(255) NOT NULL,
       model VARCHAR(255) NOT NULL,
       plate VARCHAR(7) UNIQUE NOT NULL,
       year INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE cars_items (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       car_id INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (car_id) REFERENCES cars(id)
   );
   ```

3. Veja se as tabelas foram criadas:
   ```sql
   SHOW TABLES;
   ```

#### Opção 2: Usar o sync do Sequelize

Se você preferir, pode deixar o Sequelize criar as tabelas sozinho:

1. Veja se seus modelos estão em `src/models/`

2. Modifique o arquivo `src/server.js` para incluir a sincronização:
   ```javascript
   const app = require('./app');
   const { sequelize } = require('./models');
   require('dotenv').config();

   const PORT = process.env.PORT || 3000;

   async function startServer() {
     try {
       await sequelize.authenticate();
       console.log('Database connection established successfully');
       
       // Sincronizar modelos com o banco de dados
       await sequelize.sync({ force: false });
       console.log('Database synchronized');
       
       app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
       });
     } catch (error) {
       console.error('Unable to connect to the database:', error);
       process.exit(1);
     }
   }

   startServer();
   ```

3. Para desenvolvimento:
   ```bash
   NODE_ENV=development node src/server.js
   ```

4. Pra verificar se as tabelas foram criadas:
   ```bash
   mysql -u compassuser -p -e "USE compasscar; SHOW TABLES;"
   ```

### 4. Verificando a instalação

Veja se o MySQL está funcionando:

```bash
mysql -u compassuser -p -e "SHOW DATABASES;"
```

Você deverá ver o banco de dados `compasscar` na lista.

## Executando a aplicação

Para iniciar o servidor em desenvolvimento:

```bash
npm run dev
```

## Endpoints da API

### 1. Cadastro de Carros
- **POST** `/api/v1/cars`
- **Corpo da requisição**:
  ```json
  {
    "brand": "Honda",
    "model": "Civic",
    "plate": "ABC-1D23",
    "year": 2020
  }
  ```
- **Resposta (201)**:
  ```json
  {
    "id": 1,
    "brand": "Honda",
    "model": "Civic",
    "plate": "ABC-1D23",
    "year": 2020,
    "created_at": "2023-12-01T10:00:00.000Z"
  }
  ```

### 2. Atualizar Itens do Carro
- **PUT** `/api/v1/cars/:id/items`
- **Corpo da requisição**:
  ```json
  {
    "items": [
      { "name": "Ar Condicionado" },
      { "name": "Direção Hidráulica" },
      { "name": "Vidros Elétricos" }
    ]
  }
  ```
- **Resposta (204)**: Sem conteúdo

### 3. Buscar Carro pelo ID
- **GET** `/api/v1/cars/:id`
- **Resposta (200)**:
  ```json
  {
    "id": 1,
    "brand": "Honda",
    "model": "Civic",
    "plate": "ABC-1D23",
    "year": 2020,
    "created_at": "2023-12-01T10:00:00.000Z",
    "items": [
      {
        "id": 1,
        "name": "Ar Condicionado",
        "created_at": "2023-12-01T10:05:00.000Z"
      },
      {
        "id": 2,
        "name": "Direção Hidráulica",
        "created_at": "2023-12-01T10:05:00.000Z"
      }
    ]
  }
  ```

### 4. Listar Carros com Paginação
- **GET** `/api/v1/cars?page=1&limit=5&year=2017&brand=Honda&final_plate=3`
- **Resposta (200)**:
  ```json
  {
    "count": 13,
    "pages": 7,
    "data": [
      {
        "id": 7,
        "brand": "Honda",
        "model": "Modelo 07",
        "year": 2017,
        "plate": "ABC-1D23",
        "created_at": "2023-12-03T16:30:59.000Z"
      },
      {
        "id": 8,
        "brand": "Honda",
        "model": "Modelo 08",
        "year": 2018,
        "plate": "XYZ-1203",
        "created_at": "2023-12-04T17:30:59.000Z"
      }
    ]
  }
  ```

### 5. Atualizar Dados do Carro
- **PATCH** `/api/v1/cars/:id`
- **Corpo da requisição**:
  ```json
  {
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022
  }
  ```
- **Resposta (204)**: Sem conteúdo

### 6. Excluir um Carro
- **DELETE** `/api/v1/cars/:id`
- **Resposta (204)**: Sem conteúdo

## Testando a API

Você pode testar os endpoints usando ferramentas como:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.haxx.se/)

## Validações

Validações:

- **Cadastro de carros**:
  - Campos obrigatórios: brand, model, plate, year
  - Ano deve estar entre 2015 e 2025
  - Placa deve seguir o formato ABC-1C34
  - Placa deve ser única

- **Atualização de carros**:
  - Se brand for enviado, model também deve ser
  - Ano deve estar entre 2015 e 2025 (se enviado)
  - Placa deve seguir o formato ABC-1C34 (se enviada)
  - Placa deve ser única (se enviada)

- **Atualização de itens**:
  - Máximo de 5 itens
  - Não permite itens duplicados

## Estrutura de Respostas de Erro

A API retorna erros assim:

```json
{
  "errors": [
    "mensagem de erro"
  ]
}
```