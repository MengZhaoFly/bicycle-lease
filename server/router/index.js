const router = require('koa-router')();
const crossOrigin = require('../middleware/cross-origin');
const api = require('./api');


router.use('/api/v1', api.routes(), api.allowedMethods(), crossOrigin({}));


module.exports = router;
