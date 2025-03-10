// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dev.oognuyh.com/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '' // '/api'를 ''로 치환
      }
    })
  );
};