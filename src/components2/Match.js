import "../styles/match.scss";
import {useEffect, useState} from "react"
import {useSelector,useDispatch} from "react-redux";
import {selectTimeZone} from "../features/counterSlice";
const moment=require("moment-timezone");

const Match=({match,show_ml_spread,click})=>{
    const tz=useSelector(selectTimeZone);

    
    const {
        key,
        away,
        home,
        away_moneyline,
        home_moneyline,
        away_spread,
        date,
        commence,
        home_spread,
        
        league,
        over,
        total,
        under,
    }=match;

    const pick_data=[
        away_moneyline,
        home_moneyline,

        away_spread,
        home_spread,
        
        over,
        under,
        total
    ]

    const start=moment.tz(commence,tz);
    
    return(
        <div className="match">
            <div>
                <p>{start.format("LT")}</p>
                <p>{away}</p>
                <p>{home}</p>
            </div>

            {(show_ml_spread?.default_show=="1" || show_ml_spread.default_show=="0") && <div>
                <p>ML</p>
                <button 
                    onClick={click} 
                    data-key={key} 
                    data-type={1} 
                    data-team={1} 
                    data-pickdata={pick_data}
                    data-away={away}
                    data-home={home}
                    >{away_moneyline}</button>
                <button 
                     onClick={click} 
                     data-key={key} 
                     data-type={1} 
                     data-team={2} 
                     data-pickdata={pick_data}
                     data-away={away}
                     data-home={home}
                >{home_moneyline}</button>
            </div>
            }

            {(show_ml_spread?.default_show=="2"  || show_ml_spread.default_show=="0") && <div>
                <p>Spread</p>
                <button 
                     onClick={click} 
                     data-key={key} 
                     data-type={2} 
                     data-team={1} 
                     data-pickdata={pick_data}
                     data-away={away}
                     data-home={home}
                >{away_spread}</button>
                <button
                onClick={click} 
                data-key={key} 
                data-type={2} 
                data-team={2} 
                data-pickdata={pick_data}
                data-away={away}
                data-home={home}
                >{home_spread}</button>
            </div>
            }

        


            <div>
                <p>O/U</p>
                <button 
                     onClick={click} 
                     data-key={key} 
                     data-type={3} 
                     data-team={1} 
                     data-pickdata={pick_data}
                     data-away={away}
                     data-home={home}
                >{over}</button>
                <button 
                     onClick={click} 
                     data-key={key} 
                     data-type={3} 
                     data-team={2} 
                     data-pickdata={pick_data}
                     data-away={away}
                     data-home={home}
                >{under}</button>
            </div>
        </div>
    )
}

export default Match;