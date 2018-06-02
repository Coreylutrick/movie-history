/*  eslint camelcase: 0 */
const tmdb = require('./tmdb');
const firebaseAPI = require('./firebaseAPI');
const dom = require('./dom');

const myLinks = () =>
{
  $(document).click((e) =>
  {
    if (e.target.id === 'auth')
    {
      $('#authScreen').removeClass('hide');
      $('#search').addClass('hide');
      $('#myMovies').addClass('hide');
    }
    else if (e.target.id === 'movie')
    {
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      getAllMoviesEvent();
    }
    else if (e.target.id === 'srch')
    {
      $('#search').removeClass('hide');
      $('#myMovies').addClass('hide');
      $('#authScreen').addClass('hide');
    }
  });
};

const pressEnter = () =>
{
  $(document).keypress((e) =>
  {
    if (e.key === 'Enter')
    {
      const searchWords = $('#searchBar').val().replace(' ', '%20');
      tmdb.showResults(searchWords);
    }
  });
};

const saveMovieToWishListEvent = () =>
{
  $(document).on('click', '.addMovieToWishList', (e) =>
  {
    const movieToAddCard = $(e.target).closest('.movie');
    const movieToAdd =
    {
      title: movieToAddCard.find('.movie-title').text(),
      overview: movieToAddCard.find('.movie-overview').text(),
      poster_path: movieToAddCard.find('img').data('poster'),
      rating: 0,
      isWatched: false,
    };
    firebaseAPI.saveMovieToWishlist(movieToAdd)
      .then(() =>
      {
        movieToAddCard.remove();
      })
      .catch((err) =>
      {
        console.error('error in saving movie', err);
      });
  });
};

const getAllMoviesEvent = () =>
{
  firebaseAPI.getAllMovies()
    .then((moviesArr) =>
    {
      dom.domString(moviesArr, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((err) =>
    {
      console.error(err);
    });
};

const deleteMovieFromFirebase = () =>
{
  $(document).on('click', '.deleteMovieFromCollectionEvent', ((e) =>
  {
    const movieToDeleteId = $(e.target).closest('.movie').data('firebaseId');
    firebaseAPI.deleteMovieFromDb(movieToDeleteId)
      .then(() =>
      {
        getAllMoviesEvent();
      })
      .catch((err) =>
      {
        console.error(err);
      });
  }));
};

const initializer = () =>
{
  myLinks();
  pressEnter();
  saveMovieToWishListEvent();
  deleteMovieFromFirebase();
};

module.exports =
{
  initializer,
};
