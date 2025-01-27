# CRUD Teste Técnico

Este é um frontend desenvolvido com **React**, **Vite** e **Material-UI (MUI)** para gerenciar produtos, itens e carrinhos. O frontend consome uma API CRUD para a realização das operações.
![image](https://github.com/user-attachments/assets/790ccb25-5888-4665-99db-68d74d3f799e)


## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de build de frontend, rápido e moderno.
- **Material-UI (MUI)**: Biblioteca de componentes React com temas e estilos prontos.
- **Axios**: Cliente HTTP para realizar requisições à API.

## Instalação

1. Clone o repositório para sua máquina local:

``` 
git clone <URL_DO_REPOSITORIO>
```

2. Dentro do diretório do projeto, execute o seguinte comando para instalar as dependências:

```
npm install
```
3. Configuração da API
No arquivo src/api.js, você encontrará a configuração do axios que se conecta à API. A base URL está definida para http://localhost:5134. Certifique-se de que sua API esteja rodando nesta URL, ou ajuste conforme necessário.

```
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5134", // Altere aqui para o endereço da sua API 
});

export default api;
```
## Como Usar
Após configurar a API e instalar as dependências, inicie a aplicação com:

```
npm run dev
```

## Modelo
Veja abaixo a exibição de imagem do modelo:
![image](https://github.com/user-attachments/assets/1dd0825b-e6df-4ebc-80cd-b1327bff2d01)

