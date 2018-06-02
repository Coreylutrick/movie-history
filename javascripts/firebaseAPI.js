let fireBaseConfig = {};

const setConfig = (fbConfig) =>
{
  fireBaseConfig = fbConfig;
};

const saveMovieToWishlist = (newMovie) =>
{
  return new Promise ((resolve, reject) =>
  {
    $.ajax({
      method: 'POST',
      url: `${fireBaseConfig.databaseURL}/movies.json`,
      data: JSON.stringify(newMovie),
    })
      .done((uniqueKey) =>
      {
        resolve(uniqueKey);
      })
      .fail((err) =>
      {
        reject(err);
      });
  });
};

const getAllMovies = () =>
{
  return new Promise((resolve, reject) =>
  {
    const allMoviesArr = [];
    $.ajax(
      {
        method: 'GET',
        url: `${fireBaseConfig.databaseURL}/movies.json`,
      })
      .done((allMoviesObject) =>
      {
        if (allMoviesObject !== null)
        {
          Object.keys(allMoviesObject).forEach((fbKey) =>
          {
            allMoviesObject[fbKey].id = fbKey;
            allMoviesArr.push(allMoviesObject[fbKey]);
          });
        }
        resolve(allMoviesArr);
      })
      .fail((err) =>
      {
        reject(err);
      });
  });
};

module.exports =
{
  saveMovieToWishlist,
  setConfig,
  getAllMovies,
};
