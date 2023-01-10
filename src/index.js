import { NotifyMessage, errorMessage } from './js/notify';
import { ImagesApiService, perPage } from './js/search-service';
import { refs } from './js/refs';
import { up } from './js/page-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkupImagesList } from './js/card-markup';

refs.searchForm.addEventListener('submit', onSearch);
// refs.btnLoadMore.addEventListener('click', onLoadMore); // realized this feature too (if you want to use button - change "display: none" in css)
refs.btnUp.addEventListener('click', up);

const imagesServise = new ImagesApiService(); // create new copy of the Class search-service
let gallery = new SimpleLightbox('.gallery a'); // SimpleLightbox initialization
const notify = new NotifyMessage(); // create new copy of the Class NotifyMessage

// Set functions
function onSearch(e) {
  e.preventDefault();

  imagesServise.query = e.currentTarget.elements.searchQuery.value;

  if (!imagesServise.query) {
    return notify.showFailureMessage(errorMessage);
  }

  imagesServise.resetPage();
  // handle search result
  imagesServise.fetchImages().then(handleSearchResult);
}

function handleSearchResult(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  clearImagesContainer();
  if (hits.length === 0) {
    return notify.showFailureMessage(errorMessage);
  }
  showImagesList(hits);
  notify.showSuccessMessage(`Hooray! We found ${totalHits} images.`);

  // isEndOfPage(totalHits); // check last page and hide button

  gallery.refresh(); // Destroys and reinitilized the lightbox
}

function onLoadMore() {
  imagesServise.fetchImages().then(handleLoadMore);
}

function handleLoadMore(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  showImagesList(hits);
  gallery.refresh(); // Destroys and reinitilized the lightbox

  // isEndOfPage(totalHits); // check last page and hide button
}

function showImagesList(images) {
  const markup = createMarkupImagesList(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

/* function isEndOfPage(totalHits) {
  const showBtn = imagesServise.page - 1 < Math.ceil(totalHits / perPage);
  if (showBtn) {
    showElement();
  } else {
    hideElement();
    notify.showInfoMessage();
  }
}

function showElement() {
  refs.btnLoadMore.classList.remove('visually-hidden');
}
function hideElement() {
  refs.btnLoadMore.classList.add('visually-hidden');
} */

// TODO

// const loader = document.querySelector('#loading');

const options = {
  root: null,
  rootMargin: '350px',
  threshold: 0.25,
};

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesServise.query) {
      console.log(imagesServise.query);

      console.log(entry.isIntersecting);

      onLoadMore();
    }
  });
}

const observer = new IntersectionObserver(handleIntersect, options);

observer.observe(refs.loader);
