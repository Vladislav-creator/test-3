import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import axios from "axios";
import {renderGallery} from './renderGallery';
import {loadMoreEl, searchForm, gallery, loader} from './refs';

loader.classList.replace('loader', 'is-hidden');

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  },
);

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 80;
loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");
searchForm.addEventListener('submit', onSearchForm);


function onSearchForm(e) {
  loader.classList.replace('is-hidden', 'loader');
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    loader.classList.replace('loader', 'is-hidden');
    return;
  }
  loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");
  async function makeMarkup(query, page, perPage) {
    try {
 const data = await fetchImages(query, page, perPage);
 
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
     } catch {
      console.log(error);
    } finally {
      searchForm.reset();
      loader.classList.replace('loader', 'is-hidden');
    }
  }
  makeMarkup(query, page, perPage)
}

function loadMoreHandler() {
  loader.classList.replace('is-hidden', 'loader');
  loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");
  page += 1;
  simpleLightBox.destroy();
  // simpleLightBox.refresh();
  async function makeMarkup(query, page, perPage) {
    
    try {
 const data = await fetchImages(query, page, perPage)
  // loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");
     
      renderGallery(data.photos);
      loader.classList.replace('loader', 'is-hidden');
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.total_results / perPage);

      if (page >= totalPages) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
        );
        
        loadMoreEl.classList.replace( "js-load-more", "load-more-hidden");
      } else {
        loadMoreEl.classList.replace("load-more-hidden","js-load-more");
      }
      
      
    } catch {
       console.log(error);
    }
  }
  makeMarkup(query, page, perPage);
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