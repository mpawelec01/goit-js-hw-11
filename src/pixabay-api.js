import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import { showImages, currentPage, loadMore, questionValue } from '.';

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

export { fetchImages };
