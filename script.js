document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const addModal = document.getElementById('addModal');
    const form = document.getElementById('imageForm');
    const imageModal = document.getElementById('imageModal');
    const addButton = document.getElementById('addButton');
    let currentImageId = null;

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
            <button id="editModalButton" class="btn btn-primary">Editar</button>
            <button id="deleteModalButton" class="btn btn-danger">Excluir</button>
        `;

        const editModalButton = document.getElementById('editModalButton');
        editModalButton.addEventListener('click', () => {
            editImage(image);
        });

        const deleteModalButton = document.getElementById('deleteModalButton');
        deleteModalButton.addEventListener('click', () => {
            deleteImage(image.id);
        });

        $('#imageModal').modal('show');
    }

    // Função para editar a imagem
    function editImage(image) {
        const editModal = document.getElementById('editModal');
        const editForm = document.getElementById('editImageForm');

        if (!editModal || !editForm) {
            console.error('Elementos do modal de edição não encontrados.');
            return;
        }

        editForm.editTitle.value = image.titulo;
        editForm.editDescription.value = image.descricao;

        $('#imageModal').modal('hide');
        $('#editModal').modal('show');

        editForm.addEventListener('submit', event => {
            event.preventDefault();
            submitEditForm(image);
        });
    }

    // Função para enviar os dados do formulário de edição para o servidor e atualizar a imagem na galeria
    function submitEditForm(image) {
        const editTitle = document.getElementById('editTitle').value;
        const editDescription = document.getElementById('editDescription').value;

        const editedImage = {
            id: image.id,
            titulo: editTitle,
            descricao: editDescription,
            url: image.url
        };

        fetch(`http://localhost:3000/api/editar-imagem/${editedImage.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedImage)
        })
        .then(response => response.json())
        .then(data => {
            $('#editModal').modal('hide');
            updateImageInGallery(data);
        })
        .catch(error => console.error('Erro ao editar imagem:', error));
    }

    // Função para excluir a imagem da galeria e do JSON
    function deleteImage(id) {
        fetch(`http://localhost:3000/api/excluir-imagem/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                $('#imageModal').modal('hide');
                removeImageFromGallery(id);
            } else {
                throw new Error('Erro ao excluir imagem.');
            }
        })
        .catch(error => console.error('Erro ao excluir imagem:', error.message));
    }

    // Função para remover a imagem da galeria após exclusão bem-sucedida
    function removeImageFromGallery(id) {
        const imageItem = document.querySelector(`.image-item[data-id="${id}"]`);
        if (imageItem) {
            imageItem.parentNode.remove();
        }
    }

    // Função para atualizar os dados da imagem na galeria após edição
    function updateImageInGallery(image) {
        const imageItem = document.querySelector(`.image-item[data-id="${image.id}"]`);
        if (imageItem) {
            const img = imageItem.querySelector('img');
            img.alt = image.titulo;
            const titleElement = imageItem.querySelector('.title');
            titleElement.textContent = image.titulo;
            const descriptionElement = imageItem.querySelector('.description');
            descriptionElement.textContent = image.descricao;
        }
    }

    // Carregar as imagens do arquivo dados.json ao iniciar a página
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            data.images.forEach(image => {
                addImageToGallery(image);
            });
        })
        .catch(error => console.error('Erro ao carregar as imagens:', error));
});