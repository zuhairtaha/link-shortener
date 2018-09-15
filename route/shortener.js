const {Link, LinksList} = require('../libs/LinksList');
const router = require('./pages');
const qs = require('querystring');
const {baseUrl} = require('../libs/config');
const links = new LinksList(`links.json`);
// ----------------------------------------------------
router.get('/shortener', (req, res) => res.render('view/shortener'));
// ----------------------------------------------------
router.get('/links.json', (req, res) => {
    return links
        .load()
        .then(() => res.send(JSON.stringify(links.list)))
        .catch(err => res.status(500).send(`Internal server error\n${err}`));
});
// ----------------------------------------------------
router.post('/shortener', (req, res) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
        const longUrlObj = qs.parse(body);
        const shortUrlObj = {shortUrl: baseUrl + Link.getRandomString()};
        let link;
        try {
            link = new Link({...longUrlObj, ...shortUrlObj});
        }
        catch (err) {
            res.status(401).send(err);
            return;
        }
        return links
            .load()
            .then(() => links.add(link).save())
            .then(() => res.render('view/added', link))
            .catch((err) => res.status(500).send(`Error saving link\n${err}`))
    });
});
// ----------------------------------------------------
module.exports = router;