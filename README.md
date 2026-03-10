# Portfólio - Ryan Cunha

Olá! Este é o portfólio de **Ryan**.
Ser quiser utilizar esse projeto como base, fique à vontade para **clonar ou fazer um fork**. 

O objetivo deste portfólio é ser **simples de manter**, **escalável** e totalmente baseado em **dados via JSON**, sem precisar alterar componentes sempre que um projeto novo for adicionado.

## Como iniciar o projeto

### Pré-requisitos
 - Node.js instalado
 - npm ou yarn

### Passos

1. Faça o **download**, **fork** ou **clone** do repositório
2. Abra o projeto no **VS Code**
3. No terminal, execute:

```bash
cd portfolio
npm install
npm run dev
```

## 📁 Estrutura de Dados

Todos os arquivos `.json` responsáveis pelo conteúdo do portfólio ficam na pasta:

**[`/src/data`](./portfolio/src/data/)**

### Arquivos principais 

- **[`projetos.json`](./portfolio/src/data/projetos.json)** → Projetos do portfólio
- **[`resumo.json`](./portfolio/src/data//resumo.json)** → Página Sobre Mim
- **[`contatos.json`](./portfolio/src/data/contatos.json)** → Contatos e redes sociais

## 📁 projetos.json

### Base vazia (1 categoria / 1 projeto)

```json
[
  {
    "categoria": "",
    "subCategorias": [
      {
        "titulo": "",
        "resumo": "",
        "slug": "",
        "ano": "",
        "repoGithub": "",
        "deploy": "",
        "emDesenvolvimento": true,
        "conteudo": {
          "imagem": [
            ""
          ],
          "alt": [
            ""
          ],
          "paragrafo": [
            ""
          ],
          "tags": [
            ""
          ],
          "comentarios": [
            ""
          ]
        }
      }
    ]
  }
]
```

### Adicionar mais projetos

```json
"subCategorias": [
  { },
  { }
]
```

### Adicionar nova categoria

```json
[
  { "categoria": "Front-End", "subCategorias": [] },
  { "categoria": "Back-End", "subCategorias": [] }
]
```

## Campos do projeto

 - **categoria** → Onde o projeto aparece no site
 - **titulo** → Título do projeto
 - **resumo** → Resumo rápido (hover e página interna)
 - **slug** → URL do projeto (minúsculo, sem caracteres especiais)
 - **ano** → Data do projeto
 - **repoGithub** → Repositório
 - **deploy** → Site publicado
 - **emDesenvolvimento** → Projeto em desenvolvimento

### Imagens

Todos os arquivos responsáveis por cuidar das imagens ficam na pasta:

**[`/public/projetos`](./portfolio/public/projetos/)**

```json
"imagem": [
  "/public/projetos/Projeto1/img-1.webp",
  "/public/projetos/Projeto1/img-2.webp",
  "/public/projetos/Projeto1/img-3.png",
  "/public/projetos/Projeto1/img-4.jpg"
]
```

A primeira imagem é a principal, as demais vão para o slider.

## Conteúdo interno

- `paragrafo` → Conteúdo do projeto

### Quebra de parágrafo

```json
["Texto 1", "Texto 2", "", ""]
```

### alts

- `alt` → descrição das imagens

```json
["Texto 1", "Texto 2", "", ""]
```

### tags

- `alt` → São tags

```json
["Tag 1", "Tag 2",]
```

### Links no texto

```json
["Esse site foi inspirado no [https://google.com|Google]."]
["Esse site foi inspirado no [https://google.com]."]
```

### Comentários (opcional)

- `comentarios` → cada paragrafo e uma IA escolhida no **[`/public/ia/ia.json`](./portfolio/public/assets/ia/ia.json)**

```json
"comentarios": [
  "paragrafo-1",
  "paragrafo-2",
  "paragrafo-3"
]
```

## 📁 contatos.json

```json
{
  "email": "",
  "cv": "",
  "redes": []
}
```

### Adicionar redes socias

```json
"redes": [
  {
    "nome": "Linkedin",
    "link": "https://www.linkedin.com/in/ryancunhha/"
  },
  {
    "nome": "GitHub",
    "link": "https://github.com/ryancunhha"
  }
]
```

## Campos do contatos.json

 - **email** → Contato profissional
 - **cv** → Currículo (PDF)
 - **rede** → Redes profissionais

## 📁 resumo.json

```json
{
  "marca": "",
  "bitcoin": "",
  "cripto-rede": "",
  "foto": "",
  "banner": "",
  "categoria": "",
  "boas-vindas": "",
  "resumo": [],
  "historia": []
}
```

## Campos do resumo

 - **marca** → Logo do site
 - **bitcoin** → Endereço da carteira Bitcoin (opcional)
 - **cripto-rede** → Mensagem exibida após copiar o endereço da carteira
 - **foto** → Foto pessoal exibida na página Sobre Mim
 - **banner** → Imagem de destaque da página Sobre Mim
 - **categoria** → Profissão exibida no site
 - **boas-vindas** → Frase curta exibida na página inicial
 - **resumo** → Resumo profissional em páragrafos curtos (leitura rápida)
 - **historia** → História completa da trajetória (opcional)

## Ideias futuras

1. Notificação de novos projetos
2. Compartilhamento em redes sociais
3. Modo escuro
4. HTML semântico (SEO)
5. IA integrada
6. CRUD para editar JSON
7. Projetos mais acessados

## Autor

Feito por **Ryan Cunha**  
GitHub: https://github.com/ryancunhha