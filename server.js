const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

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

    fs.readFile(dadosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dados.json:', err);
            res.status(500).send('Erro interno do servidor.');
            return;
        }

        const jsonData = JSON.parse(data);
        const newId = jsonData.images.length + 1;

        const newImage = {
            id: newId,
            titulo: titulo,
            descricao: descricao,
            url: url
        };

        jsonData.images.push(newImage);

        const updatedData = JSON.stringify(jsonData, null, 2);

        fs.writeFile(dadosPath, updatedData, (err) => {
            if (err) {
                console.error('Erro ao salvar dados no arquivo dados.json:', err);
                res.status(500).send('Erro interno do servidor.');
                return;
            }

            res.json(newImage);
        });
    });
});

// Endpoint DELETE para excluir uma imagem
app.delete('/api/excluir-imagem/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(dadosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dados.json:', err);
            res.status(500).send('Erro interno do servidor.');
            return;
        }

        const jsonData = JSON.parse(data);
        const updatedImages = jsonData.images.filter(image => image.id !== parseInt(id));

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

// Endpoint PUT para editar uma imagem
app.put('/api/editar-imagem/:id', (req, res) => {
    const id = req.params.id;
    const { titulo, descricao } = req.body;

    // Ler o arquivo dados.json
    fs.readFile(dadosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dados.json:', err);
            res.status(500).send('Erro interno do servidor.');
            return;
        }

        // Converter os dados em objeto JavaScript
        const jsonData = JSON.parse(data);

        // Encontrar a imagem com o ID fornecido
        const imageIndex = jsonData.images.findIndex(image => image.id === parseInt(id));
        if (imageIndex === -1) {
            res.status(404).send('Imagem não encontrada.');
            return;
        }

        // Atualizar as informações da imagem
        jsonData.images[imageIndex].titulo = titulo;
        jsonData.images[imageIndex].descricao = descricao;

        // Converter os dados atualizados de volta para JSON
        const updatedData = JSON.stringify(jsonData, null, 2);

        // Escrever os dados atualizados de volta no arquivo dados.json
        fs.writeFile(dadosPath, updatedData, (err) => {
            if (err) {
                console.error('Erro ao salvar dados no arquivo dados.json:', err);
                res.status(500).send('Erro interno do servidor.');
                return;
            }

            // Responder com a imagem atualizada
            res.json(jsonData.images[imageIndex]);
        });
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});