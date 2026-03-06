# 💬 StackChat - Aplicativo de Chat em Tempo Real para Desenvolvedores

👉 **[Download do APK aqui](https://github.com/Brunog-code/stack-chat-react-native/releases/download/v1.0.0/stack-chat-v1.0.0.zip)** (Android - descompacte e instale o .apk)

O **Stack Chat** é uma aplicação de chat em tempo real desenvolvida para conectar desenvolvedores em um ambiente simples, rápido e escalável. O projeto foi criado com o objetivo de **explorar o desenvolvimento mobile com React Native** e implementar comunicação **em tempo real utilizando WebSockets com Socket.IO**.

A aplicação permite autenticação de usuários via **JWT**, envio de mensagens instantâneas e atualização automática da interface conforme novas mensagens chegam, proporcionando uma experiência fluida semelhante a plataformas modernas de comunicação.

O backend foi construído utilizando **Node.js**, com uma arquitetura em camadas (**Routes → Controllers → Services**) e persistência de dados em **MongoDB**, ideal para aplicações de chat que lidam com grande volume de mensagens.

---

# 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando uma stack moderna voltada para **aplicações mobile em tempo real**.

---

## 📱 Mobile

| Tecnologia             | Badge                                                                                                                      |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **React Native**       | ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)            |
| **TypeScript**         | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)            |
| **React Native Paper** | ![React Native Paper](https://img.shields.io/badge/React_Native_Paper-6200EE?style=flat-square&logo=react&logoColor=white) |

---

## ⚙️ Backend

| Tecnologia     | Badge                                                                                                          |
| :------------- | :------------------------------------------------------------------------------------------------------------- |
| **Node.js**    | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)       |
| **Socket.IO**  | ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white) |
| **Prisma ORM** | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)            |

---

## 🗄️ Banco de Dados

| Tecnologia  | Badge                                                                                                  |
| :---------- | :----------------------------------------------------------------------------------------------------- |
| **MongoDB** | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white) |

---

## 🛡️ Autenticação & Validação

| Tecnologia               | Badge                                                                                                |
| :----------------------- | :--------------------------------------------------------------------------------------------------- |
| **JWT (JSON Web Token)** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) |
| **Zod**                  | ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=typescript&logoColor=white)    |

---

# 🛠️ Ferramentas e Infraestrutura

- **Editor de Código:** Visual Studio Code
- **Controle de Versão:** Git & GitHub
- **Containerização:** Docker
- **Hospedagem do Servidor:** VPS
- **Comunicação em Tempo Real:** WebSockets via Socket.IO

---

# ✨ Funcionalidades em Destaque

O projeto foi desenvolvido focando em **performance, comunicação em tempo real e arquitetura escalável**.

---

## 💬 Chat em Tempo Real com WebSockets

A comunicação entre os usuários é feita através de **WebSockets**, utilizando a biblioteca **Socket.IO**.

Principais características:

- **Mensagens em tempo real:** As mensagens são enviadas e recebidas instantaneamente.
- **Atualização automática da interface:** Novas mensagens aparecem sem necessidade de refresh.
- **Comunicação bidirecional:** Cliente e servidor trocam dados continuamente.
- **Alta performance:** Ideal para aplicações que exigem comunicação constante.

O uso de **WebSockets** elimina a necessidade de polling HTTP, reduzindo latência e melhorando significativamente a experiência do usuário.

---

## 🔐 Sistema de Autenticação com JWT

O sistema utiliza **JSON Web Tokens (JWT)** para autenticação segura.

Fluxo de autenticação:

1. O usuário realiza login informando suas credenciais.
2. O servidor valida os dados.
3. Um **token JWT** é gerado e enviado para o cliente.
4. O token é utilizado nas requisições protegidas.

Benefícios:

- Autenticação **stateless**
- Maior escalabilidade
- Segurança na comunicação entre cliente e servidor

---

## 🗄️ Uso do MongoDB para Escalabilidade

O **MongoDB** foi escolhido como banco de dados por ser altamente adequado para aplicações de chat.

Motivos da escolha:

- **Grande volume de mensagens:** Chats podem gerar milhões de mensagens rapidamente.
- **Modelo flexível:** Estrutura de documentos facilita armazenar mensagens e metadados.
- **Alta performance em escrita:** Ideal para sistemas com grande volume de inserções.
- **Escalabilidade horizontal:** Permite distribuir dados entre múltiplos servidores.

Esse modelo torna o sistema mais preparado para crescimento futuro.

---



## ☁️ Upload e Armazenamento de Mídia com Cloudinary

Para o armazenamento de imagens do aplicativo foi utilizado o **Cloudinary**, uma plataforma especializada em gerenciamento de mídia na nuvem.

Principais vantagens:

- **Upload seguro de imagens**
- **Armazenamento escalável na nuvem**
- **Entrega otimizada de imagens**
- **Redução de carga no servidor**

Com isso, o backend não precisa armazenar arquivos diretamente, apenas salvar as **URLs das imagens**, tornando a aplicação mais leve e escalável.

---

## 📱 Interface Mobile com React Native

O frontend foi desenvolvido utilizando **React Native com TypeScript**, focando em:

- Performance em dispositivos móveis
- Código tipado e mais seguro
- Interface moderna e responsiva

A biblioteca **React Native Paper** foi utilizada para acelerar o desenvolvimento da interface, fornecendo componentes prontos e seguindo o **Material Design**.

Componentes utilizados incluem:

- Botões
- Inputs
- Cards
- Avatares
- Componentes de layout

---

## ✔️ Validação de Dados com Zod

Toda entrada de dados no backend é validada utilizando **Zod**.

Benefícios:

- Validação tipada
- Segurança no backend
- Mensagens de erro padronizadas
- Integração perfeita com TypeScript

---

# 🏗️ Arquitetura do Projeto

O backend segue uma **arquitetura em camadas**, separando responsabilidades e facilitando manutenção.

Descrição das camadas:

**Routes**

- Responsáveis por definir os endpoints da API.

**Controllers**

- Recebem as requisições HTTP e delegam as regras de negócio.

**Services**

- Contêm a lógica principal da aplicação.

Essa separação torna o código **mais organizado, testável e escalável**.

---

# 🐳 Containerização com Docker

O servidor backend é executado dentro de um **container Docker**, garantindo consistência entre ambientes de desenvolvimento e produção.

Benefícios:

- Ambiente isolado
- Facilidade de deploy
- Elimina problemas de dependências
- Escalabilidade em servidores

O deploy do servidor foi realizado em uma **VPS**, permitindo controle total da infraestrutura.

---

## 📸 Visualização

### Página Inicial

### Login
![Pagina Login](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772829784/thumbnail-2_fayuxr.png)

### Registrar
![Register](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772829783/register_l1q0nl.png)

### Home
![Home](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772829783/home_aynzw8.png)

### Sala de chat
![Chat](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772829783/chat_flbovh.png)

### Buscar grupo
![Search](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772829783/search_rvv7ky.png)

### Perfil
![Perfil](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772829783/perfil_nvkrtt.png)

### Alterar nome
![Change Name](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772830334/change-name_jed1mo.png)

### Protótipo Figma
![Protótipo Figma](https://res.cloudinary.com/dcxpgtvqf/image/upload/v1772830477/figma_afacje.png)

---

# 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em **praticar desenvolvimento mobile com React Native** e explorar **comunicação em tempo real utilizando WebSockets**.
