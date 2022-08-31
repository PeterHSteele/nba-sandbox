import React, {useState, useEffect} from "react";
import styles from '../styles/Nba.module.css';
import ContentPanel from "../components/ContentPanel";
import player from "./api/player";

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const printDate = dateString => {
  if ( !dateString ){
    return ''
  }

  const date = new Date( dateString )
  let printed = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
  return printed;
}

const DListRow = ({term, description}) => {
  return (
    <div><dt>{term}</dt><dd>{description}</dd></div>
  )
}

export default function NBA (){
  const [players, setPlayers] = useState([
 {id: 73, firstname: 'Anthony', lastname: 'Brown', },
 {id: 74, firstname: 'Bobby', lastname: 'Brown',  },
 {id: 75, firstname: 'Jaylen', lastname: 'Brown',  },
 {id: 76, firstname: 'Lorenzo', lastname: 'Brown',  },
 {id: 77, firstname: 'Markel', lastname: 'Brown',  },
 {id: 708, firstname: 'Jabari', lastname: 'Brown',  },
 {id: 751, firstname: 'Sterling', lastname: 'Brown',  },
 {id: 944, firstname: 'Bruce', lastname: 'Brown',  },
 {id: 1186, firstname: 'Elijah', lastname: 'Brown',  },
 {id: 1187, firstname: 'Rion', lastname: 'Brown',  },
 {id: 1238, firstname: 'Anthony', lastname: 'Brown',  },
 {id: 1909, firstname: 'Bryce', lastname: 'Brown',  },
 {id: 2160, firstname: 'Moses', lastname: 'Brown',  },
 {id: 2189, firstname: 'Elijah', lastname: 'Brown',  },
 {id: 2250, firstname: 'Chad', lastname: 'Brown',  },
 {id: 2531, firstname: 'Barry', lastname: 'Brown',  },
 {id: 2545, firstname: 'Chad', lastname: 'Brown',  },
 {id: 2873, firstname: 'Isaiah', lastname: 'Brown',  },
 {id: 2971, firstname: 'Vitto', lastname: 'Brown', }
  ]);

  const [featuredPlayer, setFeaturedPlayer] = useState({})

  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gamestats, setGamestats] = useState([])
  const [featuredGame, setFeaturedGame] = useState(-1)
  const [gameInput, setGameInput] = useState('')
  const [currentSearch, setCurrentSearch] = useState('')

  const sendFormData = async () => {
    const url='/api/player?name='+lastName
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
        setPlayers(data.response)
        setCurrentSearch(lastName)
    })
  }

  const handleSelectPlayer = async ( player, index ) => {
    setFeaturedPlayer(players[index])
    let url = '/api/gamestats?season=2021&id='+player.id
    await fetch(url)
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
        setGamestats(data.response)
      })

    /*
    setGamestats([{
        assists: 3,
        blocks: 0,
        comment: null,
        defReb: 1,
        fga: 11,
        fgm: 6,
        fgp: "54.5",
        fta: 4,
        ftm: 3,
        ftp: "75.0",
        game: {id: 9867},
        min: "27:26",
        offReb: 2,
        pFouls: 1,
        player: {id: 75, firstname: 'Jaylen', lastname: 'Brown'},
        plusMinus: "-6",
        points: 16,
        pos: "SG",
        steals: 1,
        team: {id: 2, name: 'Boston Celtics', nickname: 'Celtics', code: 'BOS', logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/…on_logo.svg/1024px-Celtics_de_Boston_logo.svg.png'},
        totReb: 3,
        tpa: 2,
        tpm: 1,
        tpp: "50.0",
        turnovers: 2,
    }])*/
  }

  console.log('gamestats[0]: ' + gamestats[0]?.game.id)
  console.log('featuredGame: '+featuredGame)
  if (featuredGame) console.log(gamestats[featuredGame])

  useEffect(()=>{
    //http://localhost:3000/localhost/nba#game
    //console.log(window.location.pathname)
    if (featuredGame>-1){
      const {hostname, pathname} = window.location
      window.location.href = pathname + '#game' + featuredGame
    }
  })

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
            <input className={styles.textInput} placeholder="Tatum" type="text" id="last-name-input" onChange={e=>setLastName(e.target.value)} value={lastName} />
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
        { featuredPlayer.hasOwnProperty('lastname') && (
        <div className={styles.playerCard}>
          <h2 className={styles.featuredPlayerHeading}>Player Info</h2>
          <h3>{featuredPlayer.firstname +  ' ' + featuredPlayer.lastname}</h3>
          <dl>
            <div className={styles.dPair}>
              <dt className={styles.dTerm}>Birthday</dt><dd className={styles.dDescription}>{printDate(featuredPlayer.birth?.date)}</dd>
            </div>
            <div className={styles.dPair}><dt className={styles.dTerm}>Height</dt><dd className={styles.dDescription}>{featuredPlayer.height?.feets+"'"+featuredPlayer.height?.inches+'"'}</dd></div>
            <div className={styles.dPair}><dt className={styles.dTerm}>College</dt><dd className={styles.dDescription}>{featuredPlayer?.college}</dd></div>
            <div className={styles.dPair}><dt className={styles.dTerm}>Jersey Number</dt><dd className={styles.dDescription}>{featuredPlayer?.leagues?.standard?.jersey}</dd></div>
          </dl>
          {gamestats.length ? (
          <div>
            <h3>Game Statistics</h3>
            <p>View Stats from {gamestats.length} games in 2020-2021 season</p>
            <form>
              <label htmlFor='game-input' className={styles.label}>Game Number</label>
              <input id='game-number' className={styles.textInput} type='number' max={gamestats.length} onChange={(e)=>setGameInput(e.target.value)} value={gameInput}/>
              <button className={styles.submitButton} type="button" onClick={(e)=>setFeaturedGame(gameInput)}>Submit</button>
            </form>
            <div className={styles.games}>
              <ul className={styles.gamesList}>
                {gamestats.map((game, index)=>{
                  return (
                    <a className={styles.game}  key={game.game.id} id={'game'+index}>
                      <li>{game.game.id}</li>
                    </a>
                  )
                })}
              </ul>
            </div>
          </div>
          ) : (
            <div>Loading...</div>
          )}
          {featuredGame > -1 && gamestats[featuredGame].game.hasOwnProperty('id') && (
            <div>
              <h3>Game Id: {gamestats[featuredGame].game.id}</h3>
              <dl>
                <DListRow term="Points" description={gamestats[featuredGame].points}/>
                <DListRow term="Rebounds" description={gamestats[featuredGame].defReb + gamestats[featuredGame].offReb}/>
                <DListRow term="Assists" description={gamestats[featuredGame].assists}/>
                <DListRow term="Plus/Minus" description={gamestats[featuredGame].plusMinus}/>
              </dl>
            </div>
          )}
        </div>
        )}
        </div>
        
        
      </div>
    </div>
  )
}