import { useState, useEffect, useRef } from 'react'
import GameSummary from './GameSummary'
import styles from '../styles/GamesList.module.css'
import { months } from '../utilities/utilities'

export default function GamesList ({games, handleSelectGame}){
  let [selected, setSelected] = useState( 9 )

  let gameToScrollTo = useRef(null);

  /* 
  Given a month & array of games, 
  finds the id of first game played during that month.
  */

  const jumpToMonth = (games, month) => {
    
    const jumpTo = games.find(game=>{
      let gameDate = new Date(game.date.start),
      gameMonth = gameDate.getMonth()
      return month == gameMonth;
    })

    if ( !jumpTo ){
      jumpTo = games[0];
    }

    return jumpTo.game.id
  }

  /*
  Finds first & last months of player's season.
  Orders them in the <select> and omits offseason months.
  */

  const orderMonths = games => {
    const firstGameDate = new Date( games[0].date.start ),
    lastGameDate = new Date( games[games.length-1].date.start ),
    startMonth = firstGameDate.getMonth(),
    endMonth = lastGameDate.getMonth()

    let months = [];
    
    let counter = startMonth;
    
    if (startMonth > endMonth){
      while (counter<12){
        months.push(counter);
        counter++;
      }
    }

    counter = 0;

    if ( endMonth ){
      while ( counter <=  endMonth ){
        months.push( counter )
        counter++
      }
    }
    
    return months;
  }

  useEffect(()=>{
    let gameToScrollTo = jumpToMonth(games, selected),
    anchor = 'game'+gameToScrollTo,
    el = document.getElementById(anchor)
    
    if (el) el.scrollIntoView();
  })
 
  return (
    <div className={styles.container}>
      <h3>Game Statistics</h3>
      <p>View Stats from {games.length} games in 2020-2021 season</p>
      <form>
        <label className={styles.label} htmlFor='game-input'>Jump to Month</label>
        <select 
        onChange={e=>setSelected(e.target.value)} 
        className={styles.textInput} 
        value={selected}
        >
          {orderMonths(games).map( e => (
            <option key={e} value={e}>{months[e]}</option> 
          ))}
        </select>
      </form>
      <ul className={styles.gamesList}>
        {games.map( game => <GameSummary handleSelectGame={handleSelectGame} key={game.game.id} game={game} />)}
      </ul>
    </div>
  )
} 