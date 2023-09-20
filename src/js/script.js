import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import axios from "axios";
import {renderGallery} from './renderGallery';
export { gallery };
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  },
);

const loadMoreEl = document.querySelector(".js-load-more");
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 80;

searchForm.addEventListener('submit', onSearchForm);
loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");


function onSearchForm(e) {
  e.preventDefault();
  
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.total_results === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderGallery(data.photos);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.total_results} images.`);
       
        if (perPage < data.total_results) {
          loadMoreEl.classList.replace("load-more-hidden","js-load-more");
          
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function loadMoreHandler() {
  page += 1;
  simpleLightBox.destroy();
  // simpleLightBox.refresh();

  fetchImages(query, page, perPage)
    .then(data => {
      renderGallery(data.photos);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.total_results / perPage);

      if (page >= totalPages) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
        );
        loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");
      }
    })
    .catch(error => console.log(error));
     // Цей код дозволяє автоматично прокручувати сторінку на висоту 2 карток галереї, коли вона завантажується
     const { height: cardHeight } = document
     .querySelector('.gallery')
     .firstElementChild.getBoundingClientRect();

     window.scrollBy({
     top: cardHeight * 2,
     behavior: 'smooth',
     });
}






// кнопка “вгору”->
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});
loadMoreEl.addEventListener("click", loadMoreHandler);