const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
// ----------------------------------------------------
class Link {
    constructor(obj) {
        if (!Link.isURL(obj.longUrl)) throw new Error('url is not valid');
        this.longUrl = obj.longUrl;
        this.shortUrl = obj.shortUrl;
    }

    /**
     * validate url
     * @param {string} str
     * @returns {boolean}
     */
    static isURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }

    /**
     * get random string to be short url
     * @returns {string}
     */
    static getRandomString() {
        return Math.random().toString(36).substring(7);
    }

    /**
     * this helps JSON.stringify convert getter properties correctly
     * https://stackoverflow.com/questions/42107492/json-stringify-es6-class-property-with-getter-setter
     * @returns {{longUrl: {string}, shortUrl: {string}}}
     */
    toJSON() {
        return {
            longUrl: this.longUrl,
            shortUrl: this.shortUrl,
        }
    }
}
// ----------------------------------------------------
class LinksList {
    constructor(filename) {
        this.list = [];
        this.filename = filename;
    }

    add(link) {
        if (link instanceof Link)
            this.list.push(link);
        return this;
    }

    save() {
        return writeFile(this.filename, JSON.stringify(this.list), "utf8");
    }

    load() {
        const readFilePromise = readFile(this.filename, "utf8");
        // clean the list, since we'll add all links again
        this.list = [];
        return readFilePromise
            .then(fileString => {
                JSON.parse(fileString)
                    .forEach(linkObj => {
                        //const link = {...linkObj, shortUrl: baseUrl + linkObj.shortUrl};
                        return this.add(new Link(linkObj));
                    });
                return Promise.resolve(null);
            });
    }
}
// ----------------------------------------------------
module.exports = {Link, LinksList};