const Article = require('../models/article')
const {
  OK_CODE,
  NOT_FOUND_MESSAGE,
  ID_CAST_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require('../utils/errors')
const BadRequestError = require('../utils/errors/bad-request-err');
const ForbiddenError = require('../utils/errors/forbidden-err');
const NotFoundError = require('../utils/errors/not-found-err');


module.exports.getSavedArticles = (req, res, next) => {
  const { _id } = req.user;

  Article.find({ owner: _id, })
    .then(articles => res.status(OK_CODE).send({ data: articles }))
    .catch((err) => next(err));
}

module.exports.saveNewArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link } = req.body;
  const owner = req.user._id;

  Article.create({ keyword, title, text, date, source, link, owner })
    .then(() => res.status(OK_CODE)
      .send({ data: { keyword, title, text, date, source, link, owner } }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });

}

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId).select("+owner")
    .orFail(() => {
      const error = new Error();
      error.name = 'NotFound';
      throw error;
    })
    .then((article) => {
      if (req.user._id !== String(article.owner)) {
          const error = new Error();
          error.name = 'NotAuthorized';
          throw error;
      }
      return Article.findByIdAndDelete(articleId);
    })
    .then(article => res.status(OK_CODE).send({ data: article }))
    .catch((err) => {
      if (err.name === 'NotFound') {
          next(new NotFoundError(NOT_FOUND_MESSAGE)); 
      } else if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE));
      } else if (err.name === 'NotAuthorized') {
          next(new ForbiddenError(FORBIDDEN_MESSAGE));
      } else {
          next(err);
      }
    });

}
