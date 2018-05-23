const tmdb = require('./tmdb');

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

const initializer = () =>
{
  myLinks();
  pressEnter();
};

module.exports =
{
  initializer,
};