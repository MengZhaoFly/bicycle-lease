import axios from 'axios'

const baseUrl = 'https://192.168.1.103:3001/api/v1';

export const get = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(`${baseUrl}${url}`)
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