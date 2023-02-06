import url from 'url'

/* Query For individual game by ID */

export default async (req, res) => {
  let query = url.parse( req.url ).query;
  let nbaApiUrl =  'https://api-nba-v1.p.rapidapi.com/games?' + query
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.KEY,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  }

  await fetch(nbaApiUrl, options)
    .then(response=>response.json())
    .then(data=>res.status(200).json(data))
}