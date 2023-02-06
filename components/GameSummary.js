import styles from '../styles/GameSummary.module.css';
import { printDateShort } from '../utilities/utilities';

export default function GameSummary({game, handleSelectGame}){

  return (
    <li className={styles.game} id={'game'+game.game.id}>
      <button onClick={()=>handleSelectGame(game)} className={styles.button}>
        <p>{
          printDateShort( 
            new Date( game.date?.start ) 
          )
        }</p>
        <p>{game?.teams?.visitors?.code} <span>at</span> {game?.teams?.home?.code}</p>
      </button>
    </li>
  )
}