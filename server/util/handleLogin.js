const Router = require('koa-router');
const router = new Router();
const axios = require('axios');

const baseUrl = 'http://cnodejs.org/api/v1'

// 通过一个接口{params: accessToken} 验证accessToken 是否有效 如果有效把该接口返回值全存入session 里面
