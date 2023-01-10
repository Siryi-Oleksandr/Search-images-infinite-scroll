import { NotifyMessage, errorMessage } from './js/notify';
import { ImagesApiService, perPage } from './js/search-service';
import { refs } from './js/refs';
import { up } from './js/page-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkupImagesList } from './js/card-markup';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnUp.addEventListener('click', up);

const imagesServise = new ImagesApiService(); // create new copy of the Class search-service
let gallery = new SimpleLightbox('.gallery a'); // SimpleLightbox initialization
const notify = new NotifyMessage(); // create new copy of the Class NotifyMessage

// option  for IntersectionObserver
const optionsObserver = {
  root: null,
  rootMargin: '350px',
  threshold: 0.25,
};

const observer = new IntersectionObserver(handleIntersect, optionsObserver); // create observer which is watching to last row
const observerLastElem = new IntersectionObserver( // create observer which is watching to last elem in last page
  handleIntersectLastElem,
  optionsObserver
);

observer.observe(refs.loader);

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

  isEndOfPage(totalHits); // check last page and show message

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

  // check last page and follow for last item when it intersect viewport and show message
  const isLastPage = imagesServise.page - 1 === Math.ceil(totalHits / perPage);
  if (isLastPage) {
    observerLastElem.observe(refs.galleryContainer.lastElementChild); //observer which is watching to last elem in last page
  }
}

function showImagesList(images) {
  const markup = createMarkupImagesList(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function isEndOfPage(totalHits) {
  console.log('page', imagesServise.page);
  console.log(Math.ceil(totalHits / perPage));

  const isLastPage = imagesServise.page - 1 === Math.ceil(totalHits / perPage);
  if (isLastPage) {
    notify.showInfoMessage();
  }
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesServise.query) {
      onLoadMore();
    }
  });
}
function handleIntersectLastElem(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      notify.showInfoMessage();
    }
  });
}
