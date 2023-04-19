# Retorna os dados do IP

A aplicação tem a funcionalidade de coletar os dados do site [db-ip.com](www.db-ip.com) fornencendo o endereço do ip existente no arquivo json.

Em caso da quantidade de dados ser muito grande, ela quebra os dados em arquivos .json com um array de 1000 objetos cada, nomeando conforme cria.

## 1. Instalação

1. Clonar o repositório numa pasta local

    ```bash
    git clone git@github.com:totvs-cloud/dbip_getData.git
    ```
2. Acessar a pasta
    ```bash
    cd dbip_getData
    ```
3. Instalar as dependências
    
    3.1. npm

    ```bash
    $ npm i 
    ```
    3.2. yarn

    ```bash
    $ yarn
    ```
4. Executar a aplicação
    ```bash
    $ node index.js
    ```

<h2 style="color: red">Importante!</h2>

### Os arquivos json devem estar presentes na pasta e com os nomes dos edges: 

#### Ex: tesp02.json, tesp03.json, tece01.json, tesp04,json

## Modelo de conteúdo do arquivo json

```json
[
  {
    "IP": "187.106.26.173",
    "EDGE": "TESP03",
    "Tipo": "Linux",
    "Country_Name": "Brazil",
    "Organization": "Claro NXT Telecomunicacoes Ltda"
  },
  {
    "IP": "187.106.26.205",
    "EDGE": "TESP03",
    "Tipo": "Linux",
    "Country_Name": "Brazil",
    "Organization": "Claro NXT Telecomunicacoes Ltda"
  },
  {
    "IP": "187.106.26.237",
    "EDGE": "TESP03",
    "Tipo": "Linux",
    "Country_Name": "Brazil",
    "Organization": "Claro NXT Telecomunicacoes Ltda"
  }
]
```
