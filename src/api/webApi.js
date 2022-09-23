import axios from 'axios';
import Notiflix from 'notiflix';

export const itemPerPage = 40;

const API_KEY = '30103118-21e6b36417900a5917c3209af';
const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: itemPerPage,
});

export const BASE_URL = `https://pixabay.com/api/?${searchParams}`;
export async function getPhoto(search, page) {
  try {
    if (!search.trim()) {
      return;
    }
    const response = await axios.get(`${BASE_URL}&page=${page}&q=${search}`);
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}
