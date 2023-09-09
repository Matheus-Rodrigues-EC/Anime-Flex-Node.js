# Anime-Flex


<h3>Anime-Flex é uma aplicação web para que você possa assistir seus animes</h3>

### 👤👥 **Papéis ou tipos de usuário da aplicação**

- Administrador
- Membro
- Usuário não logado

### 🗓️📅**Entidades ou tabelas do sistema**

- Lista de Administradores
- Lista contendo os vídeos
- Lista de Membros
- Lista de Comentários
- Lista de Favoritos

### 📑📈⚙️ **Principais funcionalidades da aplicação**

- Administrador
    - Cadastrar Animes novos
    - Remover Animes já cadastrados
    - Atualizar informações dos Animes cadastrados
    - Excluir comentários
    - Adicionar novo administrador
    - Remover administrador cadastrado
    - Remover Membros
- Membro
    - Assistir animes
    - Favoritar Animes
    - Criar comentários
    - Editar comentários
    - Excluir comentários
    - Descadastrar-se como membro
- Usuário não logado
    - Assistir animes
    - Ler Comentários
    - Cadastrar-se como membro# 📽️ Anime-Flex 🎞️

## Tecnologias utilizadas
<div style="display: flex; justify-content: space-evenly; align-items: center">
    <img heigth="40" alt="Badge-Vite" src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
    <img heigth="40" alt="Badge-Vue.js" src="https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD"/>
    <img heigth="40" alt="Badge-Axios" src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/>
    <img heigth="40" alt="Badge-Styled-Components" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
</div>

## Como usar em Desenvolvimento

- ATENÇÂO. Este projeto é apenas O Back-End de uma aplicação completa, para acessar o repositório do Front-End [clique aqui](https://github.com/Matheus-Rodrigues-EC/Anime-Flex-Vue.js).

1. Clone este repositório
2. Entre na pasta criada `Anime-Flex-Node.js`
3. Instale todas as dependências com o comando
```bash
    npm install
```
4. Crie uma banco de dados com nome de sua preferência usando MongoDB
5. Crie um arquivo `.env` e configure a variável de ambiente `MONGO_URI` como o link do seu banco de dados
6. Para rodar em desenvolvimento utilize o comando
```bash
    npm run dev
```
7. Para rodar em produção utilize o comando
```bash
    npm start
```
8. Para construir a aplicação utilize
```bash
    npm run build
```
