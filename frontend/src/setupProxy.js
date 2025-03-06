// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dev.oognuyh.com/api',
      changeOrigin: true,
      buffer: false,
      selfHandleResponse: false
    })
  );
};