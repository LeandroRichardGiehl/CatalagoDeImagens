const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const dadosPath = path.join(__dirname, 'dados.json');

app.get('/api/imagens', (req, res) => {
  fs.readFile(dadosPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo dados.json:', err);
      res.status(500).send('Erro interno do servidor.');
      return;
    }
    const { imagens } = JSON.parse(data);
    res.json(imagens);
  });
});

app.get('/api/imagens/:id', (req, res) => {
  const imagemId = parseInt(req.params.id);
  fs.readFile(dadosPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo dados.json:', err);
      res.status(500).send('Erro interno do servidor.');
      return;
    }
    const { imagens } = JSON.parse(data);
    const imagem = imagens.find((img) => img.id === imagemId);
    if (!imagem) {
      res.status(404).send('Imagem não encontrada.');
    } else {
      res.json(imagem);
    }
  });
});

app.get('/api/imagens/search/:nome', (req, res) => {
  const nome = req.params.nome.toLowerCase();
  fs.readFile(dadosPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo dados.json:', err);
      res.status(500).send('Erro interno do servidor.');
      return;
    }
    const { imagens } = JSON.parse(data);
    const imagem = imagens.find(img => img.titulo.toLowerCase() === nome);
    if (!imagem) {
      res.status(404).send('Imagem não encontrada.');
    } else {
      res.json(imagem);
    }
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
