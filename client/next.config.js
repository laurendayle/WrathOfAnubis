/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    REACT_APP_URL: process.env.REACT_APP_URL,
    REACT_APP_socket_END_POINT: process.env.REACT_APP_socket_END_POINT,
  },
};

const intercept = require('intercept-stdout');

// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes('Duplicate atom key')) {
    return '';
  }
  return text;
}

if (process.env.NODE_ENV === 'development') {
  intercept(interceptStdout);
}

module.exports = nextConfig;
