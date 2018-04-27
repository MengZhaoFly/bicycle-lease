module.exports = async (ctx, next) => {
  const path = req.path
  const user = req.session.user;
  const needAccessToken = req.query.needAccessToken;
  if (needAccessToken && user.accessToken) {
    // 401
  }
  const query = Object.assign({}, req.query);
  axios('url', {
    method: req.method,
    params: query,
    data: Object.assign({}, req.body, {
      accessToken: user.accessToken
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencode'
    }
  })
  .then(response => {
    if (response.status === 200) {
      ctx.body = response.data;
    }
    else {
      ctx.body
    }
  })
}
