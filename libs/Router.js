"use strict";

const http = require('./httpExtend');
const url = require('url');

class Router extends Map {
    constructor(notFoundFn) {
        if (typeof notFoundFn !== 'function')
            throw new Error('notFoundFn must be function');
        super();
        this.notFoundFn = notFoundFn
    }

    // -----------------------------------------------------
    /**
     * get('/path', callBackFunction);
     * @param {string} path
     * @param {function} fn
     */
    get(path, fn) {
        this.validatePathAndFunction(path, fn);
        if (path.match(/,GET/g)) throw new Error('path is not allowed');

        super.set(path + ',GET', fn);
    }

    // -----------------------------------------------------
    /**
     * post('/path', callBackFunction);
     * @param {string} path
     * @param {function} fn
     */
    post(path, fn) {
        this.validatePathAndFunction(path, fn);
        if (path.match(/,POST/g)) throw new Error('path is not allowed');

        super.set(path + ',POST', fn);
    }

    // -----------------------------------------------------
    /**
     *
     * @param {string} path
     * @param {function} fn
     * @private
     */
    validatePathAndFunction(path, fn) {
        if (typeof path !== 'string') throw new Error('path must be string');
        if (typeof fn !== 'function') throw new Error('fn must be function');
    }

    // -----------------------------------------------------
    /**
     * validate req,res , then call corresponding handler function
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    dispatch(req, res) {
        if (!(req instanceof http.IncomingMessage)) throw new Error('req must be IncomingMessage');
        if (!(res instanceof http.ServerResponse)) throw new Error('req must be ServerResponse');

        const reqUrl = url.parse(req.url, true);
        const mapKey = reqUrl.pathname + ',' + req.method;

        if (super.has(mapKey)) {
            const handlerFn = super.get(mapKey);
            handlerFn(req, res); // call handler function for (rq,res)
        } else {
            this.notFoundFn(req, res); // call not found
        }
    }

    // -----------------------------------------------------
}

module.exports = Router;