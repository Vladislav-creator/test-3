// import {gallery} from './script'
import {gallery} from './refs';
function renderGallery(arr) {
  // Перевірка чи існує галерея перед вставкою даних
  if (!gallery) {
    return;
  }
  const markup = arr
    .map(
      (item) => `<a class="gallery__link" href="${item.src.large}">
          <div class="gallery-item" id="${item.id}">
            <img class="gallery-item__img" src="${item.src.medium}" alt="${item.alt}" loading="lazy" />
            <div class="info">
              <p class="info-item">${item.photographer}</p>
            </div>
          </div>
        </a>`).join('');

   gallery.insertAdjacentHTML('beforeend', markup);
}
export { renderGallery };