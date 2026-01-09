# Aplicação em VueJS de Gestão de Frota

O principal objetivo da aplicação é permitir **consulta** (listagem), **criação**, **alteração** e **exclusão** de Veículos de uma frota de concessionária, ou seja, se trata de um **CRUD** de veículos.
A aplicação possui uma página de login, na qual um dos administradores fictícios entra com usuário e senha. Apenas após o login ser feito com sucesso que ele é redirecionado para a página de visualização da frota, onde pode fazer as operações de CRUD citadas acima.

Principais Componentes do App:
- Interfaces gráficas (tela de login e tela de gerenciamento da frota)
- Backend (procedimentos e funções lógicas)
- API (serviço que responde às requisições que o usuário faz através do app)
- Banco de Dados (permite armzenar as informações dos veículos da frota)

Principais tecnologias:
- NodeJS e VueJS
  - Vue Cookies
  - Vue Router
  - Express
- SQLite

## Rodando localmente

É necessário ter o NodeJS instalado em sua máquina para conseguir rodar localmente.

Clone o projeto
```bash
  git clone https://github.com/lucasMendss/Gerenciador-de-Frota.git
```

Entre no diretório do projeto
```bash
  cd Gerenciador de Frota\gerenciador-de-frota
```

Instale as dependências
```bash
  npm install
```

Inicie o servidor
```bash
  npm run serve
```
Também é essencial iniciar o servidor da API para a aplicação funcionar. Para isso:

Entre na pasta da api
```bash
  cd api
```

Execute o arquivo *api.js*
```bash
  node api.js
```

Após esses passos, você já consegue usar o app.

Ao abrir no navegador a URL fornecida, você deve ver a tela de login. Entre com estes dados:
- Usuário: *admin1*
- Senha: *1234*
ou
- Usuário: *admin2*
- Senha: *abcd*

## Autores

- [@30felipedev](https://github.com/30felipedev)
- [@lucasMendss](https://github.com/lucasMendss)
- [@Vency54](https://github.com/Vency54)
