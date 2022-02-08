import React from 'react'
import Start from "./Start";
import HeaderBack from "./HeaderBack";

const TrophyRoom = ({userInfo}) => {
    return (
        <div className="trophyRoom">
           <HeaderBack title="Trophy Room"
             title_redux={false} 
             show_menu={false} 
             show_empty_div={true} 
             />
            <Start userInfo={userInfo} />
        </div>
    )
}

export default TrophyRoom
