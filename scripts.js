document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imagem-modal');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const modalImagem = document.getElementById('modal-imagem');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalDescricao = document.getElementById('modal-descricao');
  const modalAutor = document.getElementById('modal-autor');
  const modalData = document.getElementById('modal-data');
  const errorDisplay = document.getElementById('error-message');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function exibirModal(imagem) {
    modalTitulo.textContent = imagem.titulo;
    modalDescricao.textContent = imagem.descricao;
    modalAutor.textContent = `Autor: ${imagem.autor}`;
    modalData.textContent = `Data de Criação: ${imagem.dataCriacao}`;

    modal.style.display = 'block';
  }

  function buscarImagem(nome) {
    const imagem = imagens.find(img => img.titulo.toLowerCase() === nome.toLowerCase());
    if (imagem) {
      exibirModal(imagem);
    } else {
      errorDisplay.textContent = 'Imagem não encontrada.';
    }
  }

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      const imagemId = thumbnail.dataset.id;
      const imagem = imagens.find(img => img.id === parseInt(imagemId));
      if (imagem) {
        exibirModal(imagem);
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  const closeModal = document.querySelector('.close');
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
      buscarImagem(searchTerm);
    }
  });

  fetch('dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar os dados.');
      }
      return response.json();
    })
    .then(data => {
      imagens = data.imagens;
      thumbnails.forEach((thumbnail, index) => {
        thumbnail.querySelector('img').src = imagens[index].src;
        thumbnail.querySelector('img').alt = imagens[index].alt;
      });
    })
    .catch(error => {
      errorDisplay.textContent = 'Erro ao carregar os dados.';
      console.error('Erro ao carregar dados:', error);
    });
});
