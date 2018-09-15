const {LinksList} = require('../libs/LinksList');
const Router = require('../libs/Router');
const url = require('url');

const router = new Router(function onNotFound(req, res) {

    const reqUrl = url.parse(req.url, true);

    // if request url is a short link redirect to basic link
    if (reqUrl.pathname && req.method === 'GET') {
        const links = new LinksList(`links.json`);
        links
            .load()
            .then(() => {
                const newUrl = (links.list).find(link => link.shortUrl.includes(reqUrl.pathname)).longUrl;
                res.redirect(newUrl);
            })
            .catch(err => res.status(500).send(`Internal server error\n${err}`));
    }

    //else go to 404 error page
    else res.status(404).render('view/page404');
});

router.get('/', (req, res) => res.render('view/home'));
router.get('/about', (req, res) => res.render('view/about'));
router.get('/contact', (req, res) => res.render('view/contact'));

module.exports = router;