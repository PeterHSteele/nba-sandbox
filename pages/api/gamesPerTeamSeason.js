import url from 'url';

/* Query for all games for a given team in a given season */

export default async function( req, res ){
  let query = url.parse( req.url ).query;
  const nbaApiUrl = 'https://api-nba-v1.p.rapidapi.com/games?' + query

  const options = {
    headers: {
      'X-RapidAPI-Key': process.env.KEY,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  }

  await fetch( nbaApiUrl, options )
    .then(response=>response.json())
    .then(data=>res.status(200).json(data))
}