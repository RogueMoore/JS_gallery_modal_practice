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

const perPage = 10;
let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value;

  if (!query) {
    Notiflix.Notify.failure('Enter search query and try again');
    return;
  }

  loadData(query, currentPage);
  e.target.reset();
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadData(currentQuery, currentPage);
});

async function loadData(query, page) {
  try {
    showLoadingMessage();

    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        page: page,
        per_page: perPage,
      },
    });

    if (response.status === 200) {
      const data = response.data;

      if (data.hits.length === 0 && page === 1) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please, try again!'
        );
      }

      removeLoadingMessage();
      gallery.innerHTML += renderCards(data.hits);
      galleryLB.refresh();

      if (data.hits.length < perPage) {
        loadMoreBtn.classList.add('load-more--hide');
      } else {
        loadMoreBtn.classList.remove('load-more--hide');
      }
    }
  } catch {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
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
