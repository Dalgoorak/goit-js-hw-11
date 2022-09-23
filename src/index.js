import './css/styles.css';
import Notiflix from 'notiflix';
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import { BASE_URL, getPhoto, itemPerPage } from './api/webApi';

const gallery = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');
const inputEl = document.querySelector('.form__input');
const searchBtn = document.querySelector('.form__btn');
const totalPages = Math.ceil(500 / itemPerPage);
let page = 1;
let lightbox = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', onSubmit);
inputEl.addEventListener('input', onInput);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  data.hits.forEach(photo => {
    createCardMarkup(photo);
  });
  if (page === totalPages) {
    moreBtn.classList.add('visually-hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function onInput() {
  let searchEl = inputEl.value;
  if (searchEl.trim() === '') {
    searchBtn.disabled = true;
    clearMarkup(gallery);
    moreBtn.classList.add('visually-hidden');
    return;
  } else {
    searchBtn.disabled = false;
  }
}

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(gallery);

  const searchValue = event.currentTarget[0].value;
  mountData(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);
    const totalHits = data.totalHits;

    moreBtn.classList.remove('visually-hidden');
    moreBtn.addEventListener('click', () => {
      loadMoreCards(searchValue);
    });

    if (data.hits.length === 0) {
      moreBtn.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      gallery.innerHTML = '';
    }

    data.hits.forEach(photo => {
      createCardMarkup(photo);
    });
  } catch (error) {
    console.log(error);
  }
}

function createCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
    <a href="${largeImageURL}"><img src=${webformatURL} alt="${tags}" loading="lazy" width = "320px" height = "230px"/>
    </a>
     <div class="info">
    <p class="info-item">
      <b>Likes:</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Download:</b><span>${downloads}</span>
    </p>
  </div>
</div>`,
    lightbox.refresh()
  );
}

function clearMarkup(element) {
  element.innerHTML = '';
}
