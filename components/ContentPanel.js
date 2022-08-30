import react from 'react';
import styles from "../styles/ContentPanel.module.css"

export default function({children}) {
  return <div className={styles.contentPanel}>{children}</div>
}