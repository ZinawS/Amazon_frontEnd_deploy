import React from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import styles from './Header.module.css';

function LowerHeader() {
  return (
    <div className={styles.header_lower}>  
      <ul className={styles.header_lower_right}>
        <li className={styles.header_lower_text} ><AiOutlineMenu/>All</li>
        <li className={styles.header_lower_text}>Today's Deals</li>
        <li className={styles.header_lower_text}>Customer Service</li>
        <li className={styles.header_lower_text}>Registry</li>
        <li className={styles.header_lower_text}>Gift Cards</li>
        <li className={styles.header_lower_text}>Sell</li>
      </ul>
    </div>
  )
}

export default LowerHeader;