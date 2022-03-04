import "../styles/game_slide.scss";
import {selectTimeZone,selectLeagues} from "../features/counterSlice"
import {useSelector,useDispatch} from "react-redux";
import {basketball,
    baseball,overwatch,
    league_of_legend,
    ncaaf,ufc,ncaab,csgo,
    dota2,
    football,
    hockey,
    counter_strike,
    get_image,
    } from "./data";

const moment=require("moment-timezone")
const GameSlide=({item,id})=>{
   
    const tz=useSelector(selectTimeZone);
    const leagues=useSelector(selectLeagues);

    const id_league=leagues.filter((i)=>{
        return i.name==item.league;
    })[0].id;

   

    const date=moment(item.commence);
   
   let cl="";
   if(id==0){
       cl="active";
   }
    return(
        <button className={`game_slide ${cl}`} id={`game_${id}`}>
            {id_league==9 && <img src={baseball} />}
            {id_league==11 && <img src={overwatch} />}
            {id_league==8 && <img src={league_of_legend} />}
            {id_league==1 && <img src={ncaaf} />}
            {id_league==12 && <img src={ufc} />}
            {id_league==4 && <img src={ncaab} />}
            {id_league==10 && <img src={csgo} />}
            {id_league==7 && <img src={dota2} />}
            {id_league==2 && <img src={football} />}
            {id_league==3 && <img src={basketball} />}
            {id_league==5 && <img src={hockey} />}
            {id_league==6 && <img src={counter_strike} />}
            <div className="game_slide_one">
                <p>{item.away}</p>
                <p>vs</p>
                <p>{item.home}</p>
            </div>
            <div className="game_slide_ml">
                <p>{item.away_moneyline}</p>
                <p>ML</p>
                <p>{item.home_moneyline}</p>
            </div>

            <div className="game_slide_spread">
                <p>{item.away_spread}</p>
                <p>Spread</p>
                <p>{item.home_spread}</p>
            </div>
            <div className="game_slide_two">
                <p>{date.format("ll")}</p>
                <p>at</p>
                <p>{date.format("LT")}</p>
            </div>
        </button>
    )
}
export default GameSlide;