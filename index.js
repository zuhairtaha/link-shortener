const http = require('./libs/httpExtend');
const router = require('./route/shortener');
const {port} = require('./libs/config');

const server = http.createServer((req, res) => {
    router.dispatch(req, res);
});

server.listen(port);