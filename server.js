const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Adiciona o middleware CORS para permitir requisições de diferentes origens

const dadosPath = path.join(__dirname, 'dados.json');

// Endpoint GET para obter todas as imagens
app.get('/api/imagens', (req, res) => {
    fs.readFile(dadosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dados.json:', err);
            res.status(500).send('Erro interno do servidor.');
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData.images);
    });
});

// Endpoint POST para adicionar uma nova imagem
app.post('/api/adicionar-imagem', (req, res) => {
    const { titulo, descricao, url } = req.body;

    // Ler o arquivo dados.json
    fs.readFile(dadosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dados.json:', err);
            res.status(500).send('Erro interno do servidor.');
            return;
        }

        // Converter os dados em objeto JavaScript
        const jsonData = JSON.parse(data);

        // Gerar um ID para a nova imagem (apenas para exemplo, substitua por uma lógica de geração de IDs adequada)
        const newId = jsonData.images.length + 1;

        // Criar objeto da nova imagem
        const newImage = {
            id: newId,
            titulo: titulo,
            descricao: descricao,
            url: url
        };

        // Adicionar a nova imagem ao array de imagens
        jsonData.images.push(newImage);

        // Converter os dados atualizados de volta para JSON
        const updatedData = JSON.stringify(jsonData, null, 2);

        // Escrever os dados atualizados de volta no arquivo dados.json
        fs.writeFile(dadosPath, updatedData, (err) => {
            if (err) {
                console.error('Erro ao salvar dados no arquivo dados.json:', err);
                res.status(500).send('Erro interno do servidor.');
                return;
            }

            // Responder com a nova imagem adicionada
            res.json(newImage);
        });
    });
});

// Endpoint DELETE para excluir uma imagem
app.delete('/api/excluir-imagem', (req, res) => {
    const { id } = req.body;

    fs.readFile(dadosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dados.json:', err);
            res.status(500).send('Erro interno do servidor.');
            return;
        }

        const jsonData = JSON.parse(data);
        const updatedImages = jsonData.images.filter(image => image.id !== id);

        const updatedData = {
            images: updatedImages
        };

        fs.writeFile(dadosPath, JSON.stringify(updatedData, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar dados no arquivo dados.json:', err);
                res.status(500).send('Erro interno do servidor.');
                return;
            }

            res.status(200).send('Imagem excluída com sucesso.');
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});