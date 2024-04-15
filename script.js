document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const addModal = document.getElementById('addModal');
    const form = document.getElementById('imageForm');
    const editForm = document.getElementById('editImageForm');
    const imageModal = document.getElementById('imageModal');
    const addButton = document.getElementById('addButton'); // Adicionando referência ao botão "Adicionar"
    let currentImageId = null;

    // Carregar as imagens do arquivo dados.json ao iniciar a página
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            data.images.forEach(image => {
                addImageToGallery(image);
            });
        })
        .catch(error => console.error('Erro ao carregar as imagens:', error));

    // Função para adicionar a nova imagem à galeria
    function addImageToGallery(image) {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.titulo;
        img.dataset.id = image.id;

        img.addEventListener('click', () => {
            openImageModal(image);
        });

        imageItem.appendChild(img);
        imageContainer.appendChild(imageItem);
    }

    // Event listener para abrir o modal ao clicar no botão "Adicionar"
    addButton.addEventListener('click', () => {
        $('#addModal').modal('show');
    });

    // Event listener para submeter o formulário do modal
    form.addEventListener('submit', event => {
        event.preventDefault();
        submitFormData();
    });

    // Event listener para abrir o modal da imagem
    function openImageModal(image) {
        const modalTitle = document.querySelector('#imageModal .modal-title');
        const modalBody = document.querySelector('#imageModal .modal-body');
        currentImageId = image.id;

        modalTitle.textContent = image.titulo;
        modalBody.innerHTML = `
            <img src="${image.url}" alt="${image.titulo}" class="img-fluid mb-3">
            <p><strong>Título:</strong> ${image.titulo}</p>
            <p><strong>Descrição:</strong> ${image.descricao}</p>
            <p><strong>URL da Imagem:</strong> ${image.url}</p>
            <button id="deleteImageBtn" class="btn btn-danger">Excluir</button>
        `;

        const deleteImageBtn = document.getElementById('deleteImageBtn');
        deleteImageBtn.addEventListener('click', () => {
            deleteImage(image.id);
        });

        $('#imageModal').modal('show');
    }

    // Função para enviar os dados do formulário para o servidor e adicionar a nova imagem à galeria
    function submitFormData() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const imageUrl = document.getElementById('imageUrl').value;

        const newImage = {
            "titulo": title,
            "descricao": description,
            "url": imageUrl
        };

        fetch('http://localhost:3000/api/adicionar-imagem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newImage)
        })
        .then(response => response.json())
        .then(data => {
            $('#addModal').modal('hide');
            addImageToGallery(data);
        })
        .catch(error => console.error('Erro ao adicionar imagem:', error));
    }

    // Função para excluir a imagem da galeria e os dados do JSON
    function deleteImage(id) {
        fetch(`http://localhost:3000/api/excluir-imagem/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                $('#imageModal').modal('hide');
                removeImageFromGallery(id);
            } else {
                throw new Error('Erro ao excluir imagem.');
            }
        })
        .catch(error => console.error('Erro ao excluir imagem:', error));
    }

    // Função para remover a imagem da galeria após exclusão bem-sucedida
    function removeImageFromGallery(id) {
        const imageItem = document.querySelector(`.image-item img[data-id="${id}"]`);
        if (imageItem) {
            imageItem.parentNode.remove();
        }
    }
});