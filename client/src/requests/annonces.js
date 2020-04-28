import axios from 'axios';
const BASE_URL="http://localhost:5000/"
export async function ajouterAnnonce(obj) {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/annonces/ajouter/',
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
export async function supprimerAnnonce(id) {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/annonces/supprimer/'+id,
    headers: {
      'content-Type': 'application/json',
    },
    withCredentials: true
  });
  return axiosRequest
    .get()
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
export async function matchAnnonce(obj) {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/annonces/match/',
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
    .catch(error => {
      return {
        done: false,
        response: error
      }
    })
}
export async function getMesAnnonces() {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/annonces/mesAnnonces',
    headers: {
      'content-Type': 'application/json',
    },
    withCredentials: true
  });
  return axiosRequest
    .get()
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
export async function getAnnoncesPerdus() {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/annonces/annoncesPerdus',
    headers: {
      'content-Type': 'application/json',
    },
    withCredentials: true
  });
  return axiosRequest
    .get()
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
export async function getAnnonce(id) {
  const axiosRequest = axios.create({
    baseURL: BASE_URL + 'api/annonces/annonce/'+id,
    headers: {
      'content-Type': 'application/json',
    },
    withCredentials: true
  });
  return axiosRequest
    .get()
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
