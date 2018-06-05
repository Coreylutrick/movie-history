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
    if (e.key === 'Enter' && !$('#search').hasClass('hide'))
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

const getWatchedMoviesEvent = () =>
{
  firebaseAPI.getWatchedMovies()
    .then((moviesArr) =>
    {
      dom.domString(moviesArr, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((err) =>
    {
      console.error(err);
    });
};

const getWishlistMoviesEvent = () =>
{
  firebaseAPI.getWishlistMovies()
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

const updateMovieEvent = () =>
{
  $(document).on('click', '.updateMovieToWatched', (e) =>
  {
    const movieToUpdateId = $(e.target).closest('.movie').data('firebaseId');
    const movieToUpdateCard = $(e.target).closest('.movie');
    const updatedMovie =
    {
      title: movieToUpdateCard.find('.movie-title').text(),
      overview: movieToUpdateCard.find('.movie-overview').text(),
      poster_path: movieToUpdateCard.find('img').data('poster'),
      rating: 0,
      isWatched: true,
    };
    console.log('poop');
    firebaseAPI.updateMovieToWatchedInDb(updatedMovie, movieToUpdateId)
      .then(() =>
      {
        getAllMoviesEvent();
      })
      .catch((err) =>
      {
        console.error('surprise mutha fukka', err);
      });
  });
};

const filterEvents = () =>
{
  $('#filterButtons').on('click', (e) =>
  {
    const classList = e.target.classList;
    if (classList.contains('wishlist'))
    {
      getWishlistMoviesEvent();
    } else if (classList.contains('watched'))
    {
      getWatchedMoviesEvent();
    } else
    {
      getAllMoviesEvent();
    }
  });
};

const authEvents = () =>
{
  $('#signin-btn').click((e) =>
  {
    e.preventDefault();
    const email = $('#inputEmail').val();
    const pass = $('#inputPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then((user) =>
      {
      })
      .catch((err) =>
      {
        const errorMessage = err.message;
        console.error(errorMessage);
      });
  });
  $('#register-btn').click(() =>
  {
    const email = $('#registerEmail').val();
    const pass = $('#registerPassword').val();
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch((error) => {
      const errorMessage = error.message;
      console.error(errorMessage);
    });
  });
  $('#registerLink').click(() =>
  {
    $('#login-form').addClass('hide');
    $('#registration-form').removeClass('hide');
  });
  $('#signin-link').click((e) =>
  {
    $('#login-form').removeClass('hide');
    $('#registration-form').addClass('hide');
  });
  $('#logout').click(() =>
  {
    firebase.auth().signOut().then(function () {
      $('#auth').removeClass('hide');
      $('#authScreen').removeClass('hide');
      $('#search').addClass('hide');
      $('#myMovies').addClass('hide');
      $('#movie, #srch, #logout').addClass('hide');
    }).catch(function (error) {
      console.error(error);
    });
  });
};

const initializer = () =>
{
  myLinks();
  pressEnter();
  saveMovieToWishListEvent();
  deleteMovieFromFirebase();
  updateMovieEvent();
  filterEvents();
  authEvents();
};

module.exports =
{
  initializer,
  getAllMoviesEvent,
};
