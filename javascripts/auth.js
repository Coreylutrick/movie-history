const {getAllMoviesEvent,} = require('./events');

const checkLoginStatus = () =>
{
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $('#movie, #srch, #logout').removeClass('hide');
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      $('#auth').addClass('hide');
      getAllMoviesEvent();
    } else {
      $('#movie, #srch, #logout').addClass('hide');
      $('#myMovies').addClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').removeClass('hide');
    }
  });
};

module.exports =
{
  checkLoginStatus,
};
