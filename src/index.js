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
let searchValue = '';

formEl.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(gallery);

  searchValue = event.currentTarget.elements.searchQuery.value.trim();

  if (searchValue === '') {
    return;
  } else {
    mountData(searchValue);
  }
}
async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  createCardMarkup(data.hits);
  if (page === totalPages) {
    moreBtn.classList.add('visually-hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);
    const totalHits = data.totalHits;

    moreBtn.classList.remove('visually-hidden');
    moreBtn.removeEventListener('click', listenerCallback);
    moreBtn.addEventListener('click', listenerCallback);

    if (data.hits.length === 0) {
      moreBtn.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      gallery.innerHTML = '';
      createCardMarkup(data.hits);
    }
  } catch (error) {
    Notiflix.Notify.failure(
      '"Sorry, there are no images matching your search query. Please try again."'
    );
  }
}

function listenerCallback() {
  loadMoreCards(searchValue);
}

function createCardMarkup(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" 
          alt="${image.tags}" title="${image.tags}" loading="lazy" width = "320px" height = "230px"/></a>
        <div class="info">
           <p class="info-item">
           <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
           </p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
  lightbox.refresh();
}

function clearMarkup(element) {
  element.innerHTML = '';
}

// function createCardMarkup({
//   webformatURL,
//   largeImageURL,
//   tags,
//   likes,
//   views,
//   comments,
//   downloads,
// }) {
//   gallery.insertAdjacentHTML(
//     'beforeend',
//     `<div class="photo-card">
//     <a href="${largeImageURL}"><img src=${webformatURL} alt="${tags}" loading="lazy" width = "320px" height = "230px"/>
//     </a>
//      <div class="info">
//     <p class="info-item">
//       <b>Likes:</b><span>${likes}</span>
//     </p>
//     <p class="info-item">
//       <b>Views:</b><span>${views}</span>
//     </p>
//     <p class="info-item">
//       <b>Comments:</b><span>${comments}</span>
//     </p>
//     <p class="info-item">
//       <b>Download:</b><span>${downloads}</span>
//     </p>
//   </div>
// </div>`,
//     lightbox.refresh()
//   );
// }
