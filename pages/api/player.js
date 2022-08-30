import url from 'url'

export default async function( req, res ){
  const query = url.parse(req.url).query
  let apiNbaUrl = "https://api-nba-v1.p.rapidapi.com/players?" + query;
  const options = {
    method: 'GET',
    headers: {
     'X-RapidAPI-Key': process.env.KEY,
     'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };
  const response = await fetch(apiNbaUrl, options)
    .then(response=>response.json())
    .then(data=>res.status(200).json(data))
}