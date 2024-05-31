const router = require('express').Router();
const { getSavedArticles, saveNewArticle, deleteArticle } = require('../controllers/articles');
const auth = require('../middlewares/auth');
const { validateArticle } = require('../middlewares/validator');

router.get('/articles/', auth, getSavedArticles);
router.post('/articles/', auth, validateArticle, saveNewArticle);
router.delete('/articles/:articleId', auth, deleteArticle);

module.exports = router;
