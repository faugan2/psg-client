import React from 'react'
import "../styles/joinning_not_enougth_coins.scss";

export default function JoinningNotEnougthCoins() {
  return (
    <div className="joinning_not_enougth_coins">
        <p>You don't have enougth coins to join this challenge</p>
        <button>Buy coins now</button>
    </div>
  )
}
