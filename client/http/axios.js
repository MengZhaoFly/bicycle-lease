import axios from 'axios'

// client
if (typeof localStorage !== 'undefined' && localStorage.getItem('jwt')) {
  axios.defaults.headers.common['authorization'] = localStorage.getItem('jwt');
}
// server session
const baseUrl = 'https://182.98.129.131:3001/api/v1';

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(`${baseUrl}${url}`, {
      params: params
    })
      .then(resp => {
        resolve(resp.data)
      }).catch(reject)
  })
}

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}${url}`, data)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(reject)
  })
}

export default {
  get,
  post
}