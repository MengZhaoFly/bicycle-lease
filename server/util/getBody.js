const axios = require('axios');
const preFix = 'http://localhost:8888';

const getTemplate = (url) => {
  const httpUrl = preFix + url;
  return new Promise((resolve, reject) => {
    axios.get(httpUrl)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log('axios err and err url is ', httpUrl);
        reject(err);
      });
  });
};

module.exports = getTemplate;
