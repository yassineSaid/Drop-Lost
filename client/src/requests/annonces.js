import axios from 'axios';

export async function ajouterAnnonce(obj) {
  const axiosRequest = axios.create({
    baseURL: "http://localhost:5000/" + 'api/annonces/ajouter/',
    headers: {
      'content-Type': 'application/json',
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
}
