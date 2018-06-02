/*  eslint camelcase: 0 */
const dom = require('./dom');

let tmdbKey = '';
let imageConfig = {};

const setKey = (key) =>
{
  tmdbKey = key;
  getConfig();
};

const getImageConfig = () =>
{
  return imageConfig;
};

const getConfig = () =>
{
  tmdbconfiguration()
    .then((result) =>
    {
      imageConfig = result.images;
    })
    .catch((err) =>
    {
      console.error(err);
    });
};

const tmdbconfiguration = () =>
{
  return new Promise((resolve, reject) =>
  {
    $.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`)
      .done((data) =>
      {
        resolve(data);
      })
      .fail((error) =>
      {
        reject(error);
      });
  });
};

const searchTMDB = (txt) =>
{
  return new Promise((resolve, reject) =>
  {
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${txt}&include_adult=false`)
      .done((result) =>
      {
        resolve(result.results);
      })
      .fail((err) =>
      {
        reject(err);
      });
  });
};

const showResults = (searchText) =>
{
  searchTMDB(searchText)
    .then((result) =>
    {
      dom.domString(result, imageConfig, 'movies');
    })
    .catch((err) =>
    {
      console.error(err);
    });
};

module.exports =
{
  showResults,
  setKey,
  getImageConfig,
};
