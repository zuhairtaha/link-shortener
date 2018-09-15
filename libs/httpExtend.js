const http = require('http');
const helper = require('./helper');
const {promisify} = require('util');
const {readFile} = require('fs');
const {baseUrl} = require('../libs/config');
// ----------------------------------------------------
/**
 * send html string to a page
 * @param {*}body
 * @returns {http.ServerResponse}
 */
http.ServerResponse.prototype.send = function (body) {
    if (!this.statusCode) this.status(200);
    this.end(String(body));
    return this;
};

// ----------------------------------------------------
/**
 * set response status
 * @param {number} status
 * @returns {http.ServerResponse}
 */
http.ServerResponse.prototype.status = function (status) {
    this.statusCode = status;
    this.statusMessage = http.STATUS_CODES[status];
    switch (status) {
        case 500:
        case 401:
            this.setHeader('Content-Type', 'text/plain');
            break;
        default:
            this.setHeader('Content-Type', 'text/html');
            break;
    }
    return this;
};
// ----------------------------------------------------
/**
 * render ejs files at view folder
 * @param {string} view - file path
 * @param {Object} data?
 */
http.ServerResponse.prototype.render = function (view, data = null) {

    const read = promisify(readFile);
    read(`./${view}.ejs`, 'utf-8')
        .then(fileContent => {
            let body = helper.replaceIncludesWithContent(fileContent);
            if (data) body = helper.mergeData(body, data);
            this.status(200).send(body);
        }).catch(error => {
        this.status(404).send(`View File Not Found \n${error}`)
    });
};

// ----------------------------------------------------
http.ServerResponse.prototype.redirect = function (newUrl) {
    this.writeHead(302, {'Location': newUrl});
    this.end();
};
// ----------------------------------------------------
module.exports = http;