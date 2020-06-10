import axios from 'axios';
const BASE_URL=process.env.REACT_APP_API_URL
export async function ajouterReclamation(obj) {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/reclamations/ajouterReclamation/',
    headers: {
      'content-Type': 'multipart/form-data',
    },
    withCredentials: true
  });
  return axiosRequest
    .post('',obj)
    .then(result => {
      return {
        done: true,
        response: result
      }
    })
    .catch(error => {
      return {
        done: false,
        response: error
      }
    })
}