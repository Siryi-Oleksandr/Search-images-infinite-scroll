import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImagesApiService, perPage } from './js/search-service';
import { refs } from './js/refs';
import { smoothPageScrolling, up } from './js/page-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const throttle = require('lodash.throttle');
import { createMarkupImagesList } from './js/card-markup';
import './js/infinite-scroll';
import InfiniteScroll from 'infinite-scroll';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore); // realized this feature too (if you want to use button - change "display: none" in css)
refs.btnUp.addEventListener('click', up);

const errorMessage =
  'Sorry, there are no images matching your search query. Please try again.';

const imagesServise = new ImagesApiService(); // create new copy of the Class search-service
let gallery = new SimpleLightbox('.gallery a'); // SimpleLightbox initialization

// Set functions
function onSearch(e) {
  e.preventDefault();

  refs.btnLoadMore.classList.add('visually-hidden');

  imagesServise.query = e.currentTarget.elements.searchQuery.value;

  if (!imagesServise.query) {
    return Notify.failure(errorMessage);
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
    return Notify.failure(errorMessage);
  }
  showImagesList(hits);
  Notify.success(`Hooray! We found ${totalHits} images.`);

  isEndOfPage(totalHits); // check last page and hide button

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

  isEndOfPage(totalHits); // check last page and hide button

  smoothPageScrolling(); // add smooth page scrolling (disabled for infinite scroll) this feature actual for button Load More
}

function showImagesList(images) {
  const markup = createMarkupImagesList(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function isEndOfPage(totalHits) {
  const notifyOptions = {
    position: 'center-bottom',
    distance: '50px',
    timeout: 4000,
    clickToClose: true,
    cssAnimationStyle: 'from-bottom',
    showOnlyTheLastOne: true,
  };

  const showBtn = imagesServise.page - 1 < Math.ceil(totalHits / perPage);
  if (showBtn) {
    refs.btnLoadMore.classList.remove('visually-hidden');
  } else {
    refs.btnLoadMore.classList.add('visually-hidden');
    Notify.info(
      "We're sorry, but you've reached the end of search results.",
      notifyOptions
    );
  }
}

// Infinite Scroll (leave for me)

// function infiniteScroll() {
//   let isAddToPage =
//     window.scrollY + window.innerHeight >=
//     document.documentElement.scrollHeight - 400;

//   if (isAddToPage) {
//     onLoadMore();
//   }
// }

// console.log(InfiniteScroll);

const loader = document.querySelector('#loading');

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

observer.observe(loader);
