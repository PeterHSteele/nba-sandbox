import React, {useState, useEffect} from "react";
import styles from '../styles/Nba.module.css';
import ContentPanel from "../components/ContentPanel";
import player from "./api/player";
import gamesPerTeamSeason from "./api/gamesPerTeamSeason";
import GameSummary from '../components/GameSummary'
import GamesList from '../components/GamesList'
import TextInput from '../components/TextInput'
import { printDate } from '../utilities/utilities'
import Graph from '../components/Graph'

const DListRow = ({term, description}) => {
  return (
    <div className={styles.dPair}><dt className={styles.dTerm}>{term}</dt><dd className={styles.dDescription}>{description}</dd></div>
  )
}

/*
Add info about which teams were playing to the game stats for an individual player.
*/

const addGameInfo = ( playerStats, gameStats ) => {
  playerStats.forEach( game => {
    const id = game.game.id;
    const teamGame = gameStats.find(game => id == game.id)
    
    if (!teamGame){
      console.log('game id not found')
      return
    }

    game.teams = teamGame.teams
    game.date = teamGame.date
    game.scores = teamGame.scores
  })

  return playerStats
}

 /* Given an array of all games a player has played in a given season,
  will return ids for all teams he played for that season */

  const findTeams = gamestats => {
    const teamIds = []
    gamestats.forEach( game => {
      if ( -1 === teamIds.indexOf( game.team.id ) ){
        teamIds.push( game.team.id );
      }
    })
    return teamIds;
  }

export default function NBA (){
  const [players, setPlayers] = useState([
    {id: 897, firstname: 'Derrick', lastname: 'White' },
  ]);

  const [featuredPlayer, setFeaturedPlayer] = useState({})
  const [lastName, setLastName] = useState('')
  const [gamestats, setGamestats] = useState([])
  const [featuredGame, setFeaturedGame] = useState({})
  const [currentSearch, setCurrentSearch] = useState('')

  const sendFormData = async () => {
    const url='/api/player?name='+lastName
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
        //console.log(data)
        setLastName(''); 
        setCurrentSearch(lastName)
        setPlayers(data.response)
        setFeaturedGame({})
        setGamestats([])
    })
  }

  /* 
  When a player is selected, loads their stats for each game of 2021 season.
  Also adds teams and dates of each game from the api-nba games endpoint.
  */ 

  const handleSelectPlayer = async ( player, index ) => {
    setFeaturedPlayer(players[index])
    let url = '/api/gamestats?season=2021&id='+player.id
    
    const gamestats =  await fetch(url)
      .then(response=>response.json())
      
    
    //console.log('gamestats',gamestats);

    const teams = findTeams(gamestats.response)

    const gamesRequests = teams.map( async team => {
      let gamesUrl = '/api/gamesPerTeamSeason?season=2021&team=' + team
      return fetch(gamesUrl)
        .then(response=>response.json())
        .then(data=>data.response)
    } )

    Promise.all(gamesRequests).then(teamSeasons=>{
      let teamGames = teamSeasons.reduce((season1, season2)=>season1.concat(season2),[])
      //console.log('teamGames',teamGames);
      let stats = addGameInfo( gamestats.response, teamGames )
      setGamestats(stats);
    })
    
    //setGamestats(dummyGameStats);
    
  }

  const handlePlayerInputChange = e => {
    setLastName(e.target.value)
  }

  /*
  let dummyMonths = [{
    date: {
      duration: "2:26",
      end: "2022-05-09T03:36:00.000Z",
      start: "2022-05-09T01:00:00.000Z",
    },
    game: {id: 10972},
  },
  {
    date:{
      duration: "2:28",
      end: "2022-06-14T03:37:00.000Z",
      start: "2022-06-14T01:00:00.000Z",
    },
    game: {id: 10974},
  }]

  console.log('jTM test', jumpToMonth(dummyMonths, 5))
  */

  //console.log( gamestats[0])
  //console.log(featuredGameData)
  /*
  useEffect(()=>{
    //http://localhost:3000/localhost/nba#game
    //console.log(window.location.pathname)
    if (featuredGame>-1){
      const {hostname, pathname} = window.location
      window.location.href = pathname + '#game' + featuredGame
    }
  })
*/
  /*
   <label htmlFor="name-input">Name</label>
        <input type="text" id="first-name-input" onChange={e=>setName(e.target.value)} value={name} />
        <label htmlFor="first-name-input">First Name</label>
        <input type="text" id="first-name-input" onChange={e=>setFirstName(e.target.value)} value={firstName} />

        <select>
                {gamestats.map((e,i)=>{
                  return <option key={e.id}>Game {i}</option>
                })}
              </select>
  */

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h1 className={styles.pageTitle}>Look Up an NBA Player</h1>
          <form className={styles.playerForm}>
            <label className={styles.label} htmlFor="last-name-input">Player&apos;s Last Name</label>
            <TextInput
            handleChange={handlePlayerInputChange}
            value={lastName}
            placeholder="Tatum"
            id="last-name-input"
            style={styles.textInput}
            />
            <button className={styles.submitButton} type="button" onClick={sendFormData}>Submit</button>
          </form>
          { players.length ?
            <div className={styles.playerLookupContainer}>
              <p>Showing {players.length} players with last name &quot;{currentSearch}&quot;</p>  
              <ul className={styles.playerList}>
              {players.map((e,i)=>{
                return (
                  <li key={e.id}>
                    <button className={styles.playerLink} onClick={()=>handleSelectPlayer(e,i)}>{e.firstname + ' ' + e.lastname}</button>
                  </li>
                )
              })}
              </ul>
            </div> : null
          }
        </div>
        <div className={styles.main}>
          {featuredPlayer.hasOwnProperty('lastname') && (
            <div className={styles.playerCard}>
              <h2 className={styles.featuredPlayerHeading}>Player Info</h2>
              <h3>{featuredPlayer.firstname +  ' ' + featuredPlayer.lastname}</h3>
              <dl>
                <DListRow term="Birthday" description={printDate(featuredPlayer.birth?.date)} />
                <DListRow term="Height" description={featuredPlayer.height?.feets+"'"+featuredPlayer.height?.inches+'"'} />
                <DListRow term="College" description={featuredPlayer?.college} />
                <DListRow term="Jersey Number" description={featuredPlayer?.leagues?.standard?.jersey} />
              </dl>
              {gamestats.length ? ( 
              <GamesList 
              games={gamestats} 
              handleSelectGame={setFeaturedGame}
              />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          )}
          {featuredGame.hasOwnProperty('game') && (
            <div className={styles.playerCard}>
              <h2 className={styles.featuredPlayerHeading}>Game Info</h2>
              <div>
                <h3>
                  {featuredGame.teams.visitors.name} at {featuredGame.teams.home.name}
                </h3>
                <p>{printDate(featuredGame.date.start)}</p>
                <p>{featuredPlayer.firstname +  ' ' + featuredPlayer.lastname}'s stats:</p>
                <dl>
                  <DListRow term="Points" description={featuredGame.points}/>
                  <DListRow term="Rebounds" description={featuredGame.defReb + featuredGame.offReb}/>
                  <DListRow term="Assists" description={featuredGame.assists}/>
                  <DListRow term="Plus/Minus" description={featuredGame.plusMinus}/>
                </dl>
              </div>
            </div>
            )}
          {featuredPlayer.hasOwnProperty('lastname') && gamestats.length && (
            <div className={`${styles.playerCard} ${styles.fullWidth}`}>
              <Graph games={gamestats} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
/*

*/
/*
Game Object

arena: {name: 'Amway Center', city: 'Orlando', state: 'FL', country: 'USA'}
date:
duration: "2:07"
end: "2021-11-04T01:17:00.000Z"
start: "2021-11-03T23:00:00.000Z"
[[Prototype]]: Object
id: 8896
leadChanges: 3
league: "standard"
nugget: null
officials: (3) ['Sean Wright', 'Tyler Ricks', 'Brandon Adair']
periods: {current: 4, total: 4, endOfPeriod: false}
scores: {visitors: {…}, home: {…}}
season: 2021
stage: 2
status: {clock: null, halftime: false, short: 3, long: 'Finished'}
teams:
home: {id: 26, name: 'Orlando Magic', nickname: 'Magic', code: 'ORL', logo: 'https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png'}
visitors: {id: 2, name: 'Boston Celtics', nickname: 'Celtics', code: 'BOS', logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/…on_logo.svg/1024px-Celtics_de_Boston_logo.svg.png'}
[[Prototype]]: Object
timesTied: 6
*/

/*
Player stats per game returned from api

0:
assists: 3
blocks: 1
comment: null
defReb: 4
fga: 16
fgm: 8
fgp: "50.0"
fta: 6
ftm: 5
ftp: "83.3"
game: {id: 10798}
min: "26:23"
offReb: 0
pFouls: 1
player: {id: 75, firstname: 'Jaylen', lastname: 'Brown'}
plusMinus: "4"
points: 25
pos: "SG"
steals: 1
team: {id: 2, name: 'Boston Celtics', nickname: 'Celtics', code: 'BOS', logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/…on_logo.svg/1024px-Celtics_de_Boston_logo.svg.png'}
totReb: 4
tpa: 12
tpm: 4
tpp: "33.3"
turnovers: 3
*/

let dummyGameStats = [{
  assists: 2,
  blocks: 1,
  comment: null,
  date: {
    duration: "2:26",
    end: "2022-06-09T03:36:00.000Z",
    start: "2022-06-09T01:00:00.000Z",
  },
  defReb: 1,
  fga: 9,
  fgm: 3,
  fgp: "33.3",
  fta: 1,
  ftm: 1,
  ftp: "100",
  game: {id: 10972},
  min: "23:35",
  offReb: 0,
  pFouls: 2,
  player: {id: 897, firstname: 'Derrick', lastname: 'White'},
  plusMinus: "-12",
  points: 7,
  pos: null,
  steals: 1,
  team: {id: 2, name: 'Boston Celtics', nickname: 'Celtics', code: 'BOS', logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/…on_logo.svg/1024px-Celtics_de_Boston_logo.svg.png'},
  teams: {
    visitors: {
      code: "GSW",
      id: 11,
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/d/de/Warriors_de_Golden_State_logo.svg/1200px-Warriors_de_Golden_State_logo.svg.png",
      name: "Golden State Warriors",
      nickname: "Warriors",
    }, 
    home:{
      code: "BOS",
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
      name: "Boston Celtics",
      nickname: "Celtics"
    }
  },
  totReb: 1,
  tpa: 3,
  tpm: 0,
  tpp: "0.0",
  turnovers: 1,
},
{
  assists: 3,
  blocks: 0,
  comment: null,
  date:{
    duration: "2:28",
    end: "2022-06-14T03:37:00.000Z",
    start: "2022-06-14T01:00:00.000Z",
  },
  defReb: 1,
  fga: 4,
  fgm: 0,
  fgp: "0.0",
  fta: 2,
  ftm: 1,
  ftp: "50.0",
  game: {id: 10974},
  min: "21:24",
  offReb: 0,
  pFouls: 1,
  player:{
    firstname: "Derrick",
    id: 897,
    lastname: "White",
  },
  plusMinus: "-13",
  points: 1,
  pos: null,
  steals: 1,
  team: {
    code: "BOS",
    id: 2,
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
    name: "Boston Celtics",
    nickname: "Celtics",
  },
  teams:{
    home:{
      code: "GSW",
      id: 11,
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/d/de/Warriors_de_Golden_State_logo.svg/1200px-Warriors_de_Golden_State_logo.svg.png",
      name: "Golden State Warriors",
      nickname: "Warriors",
    },
    visitors:{
      code: "BOS",
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
      name: "Boston Celtics",
      nickname: "Celtics",
    }
  },
  totReb: 1,
  tpa: 3,
  tpm: 0,
  tpp: "0.0",
  turnovers: 0,
},
{
  assists: 2,
  blocks: 0,
  comment: null,
  date:{
    duration: "2:21",
    end: "2022-06-17T03:31:00.000Z",
    start: "2022-06-17T01:00:00.000Z",
  },
  defReb: 1,
  fga: 6,
  fgm: 1,
  fgp: "16.7",
  fta: 0,
  ftm: 0,
  ftp: "0.0",
  game: {id: 10975},
  min: "16:27",
  offReb: 0,
  pFouls: 1,
  player: {id: 897, firstname: 'Derrick', lastname: 'White'},
  plusMinus: "-26",
  points: 2,
  pos: null,
  steals: 0,
  team: {
    id: 2, 
    name: 'Boston Celtics', 
    nickname: 'Celtics', 
    code: 'BOS', 
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/…on_logo.svg/1024px-Celtics_de_Boston_logo.svg.png'
  },
  teams:{
    home: {
      code: "BOS",
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
      name: "Boston Celtics",
      nickname: "Celtics",
    },
    visitors:{
      code: "GSW",
      id: 11,
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/d/de/Warriors_de_Golden_State_logo.svg/1200px-Warriors_de_Golden_State_logo.svg.png",
      name: "Golden State Warriors",
      nickname: "Warriors",
    }
  },
  totReb: 1,
  tpa: 2,
  tpm: 0,
  tpp: "0.0",
  turnovers: 1,
}
]