import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
loadMore.hidden = true;

let currentPage = 1;
let questionValue = '';

const URL = 'https://pixabay.com/api/?key=';

const fetchImages = async () => {
  try {
    const response = await axios.get(URL, {
      params: {
        key: '33466637-d94c21d9f8bc92b1e95bebd3f',
        q: questionValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      showImages(response.data.hits);
      if (currentPage === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      if (response.data.totalHits <= currentPage * 40) {
        loadMore.disabled = true;
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMore.disabled = false;
        loadMore.style.display = 'block';
      }
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

const showImages = images => {
  images.map(image => {
    gallery.insertAdjacentHTML(
      'beforeend',
      `<div class='photo-card'><a class='photo-card--link' href='${image.largeImageURL}'><img src='${image.webformatURL}' alt='${image.tags}' loading='lazy'/></a><div class='info'><p class='info-item'><b>Likes</b>${image.likes}</p><p class='info-item'><b>Views</b>${image.views}</p><p class='info-item'><b>Comments</b>${image.comments}</p><p class='info-item'><b>Downloads</b>${image.downloads}</p></div></div>`
    );
  });
  console.log(gallery);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};
form.addEventListener('submit', event => {
  event.preventDefault();
  const inputValue = event.currentTarget.elements.searchQuery.value;

  if (inputValue.trim() === '') {
    Notiflix.Notify.failure('Error. You must enter something.');
    questionValue = '';
    return;
  }

  questionValue = inputValue;
  gallery.innerHTML = '';
  currentPage = 1;
  fetchImages();
});

loadMore.addEventListener('click', () => {
  currentPage++;
  fetchImages();

  const galleryElement = document.querySelector('.gallery');

  if (gallery.firstElementChild) {
    const { height: cardHeight } =
      galleryElement.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
