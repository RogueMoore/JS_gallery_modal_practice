import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const galleryLB = new SimpleLightbox('.gallery a');

const API_KEY = '47398342-c4f399e57f5c71f1dbfff10b5';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value;

  if (!query) {
    // errorMessage();
    Notiflix.Notify.failure('Enter search query and try again');
    return;
  }

  loadData(query);
  e.target.reset();
});

async function loadData(query = '') {
  try {
    showLoadingMessage();
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query || '',
      },
    });

    if (response.status === 200) {
      removeLoadingMessage();
      loadMoreBtn.classList.remove('load-more--hide');

      const data = response.data;

      gallery.innerHTML = renderCards(data.hits);
      galleryLB.refresh();
    }
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please, try again!'
    );
  } finally {
    removeLoadingMessage();
  }
}

function showLoadingMessage() {
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Loading images, please wait...';
  loadingMessage.id = 'loading-message';
  loadMoreBtn.insertAdjacentElement('beforebegin', loadingMessage);
}

function removeLoadingMessage() {
  const loadingMessage = document.querySelector('#loading-message');

  if (loadingMessage) {
    loadingMessage.remove();
  }
}

function createCard(card) {
  return `
    <a href="${card.largeImageURL}" class="photo-card">
      <img src="${card.previewURL}" alt="${card.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${card.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${card.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${card.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${card.downloads}
        </p>
        </div>
      </a>
   `;
}

function renderCards(cards) {
  return cards.map((c) => createCard(c)).join('');
}
