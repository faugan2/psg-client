import "../styles/game_item.scss";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {useState,useEffect,} from "react";
import {useHistory} from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {selectSport,selectTournaments,selectLeagues} from "../features/counterSlice";
const GameItem=({game,click})=>{
    const s=useSelector(selectSport);
    const l=useSelector(selectLeagues);
    const [league,set_league]=useState(null);
    const [type,set_type]=useState("");
    const [entry,set_entry]=useState("Free");
    const [mode,set_mode]=useState("Most Wins");

    console.log(game.url);

    useEffect(()=>{
        if(game==null || s==null || l==null) return;
        
        const res=l.filter((item)=>{
           return item.id==game.league;
        })
        if(res.length>0){
            set_league(res[0]);
        }

        if(game.type=="2"){
            set_type("Heads Up");
        }else if(game.type=="3"){
            set_type("Sports Booth");
        }else if(game.type=="4"){
            set_type("Tournamnt");
        }

        if(game.entry=="0"){
            set_entry("Free");
        }else{
            set_entry(game.entry+" Coins");
        }

        if(game.mode=="1"){
            set_mode("Most Wins");
        }else{
            set_mode("Long Win Str")
        }
       
    },[s,l,game]);
    return(
        <div className="game_item" onClick={click}>
            <div className="head">
                {/*game?.type=="2" && <SupervisorAccountIcon style={{fontSize:"3rem" ,opacity:0.6}} />}
                {game?.type=="3" && <GroupAddIcon style={{fontSize:"3rem" ,opacity:0.6}} />}
                {game?.type=="4" && <GroupAddIcon style={{fontSize:"3rem" ,opacity:0.6}} />*/}
                {(game?.url!=null && game?.url!=undefined) && 
                    <img src={game.url} />
                }
                <h1>{type}</h1>
                <p>{league?.name}</p>
            </div>

            <div className="body">
                <div>
                    <p>Entry</p>
                    <p className="entry">{entry}</p>
                </div>
                <div>
                    <p>Mode</p>
                    <p>Most wins</p>
                </div>
                <div>
                    <p>#Games</p>
                    <p>{game?.number_game}</p>
                </div>
            </div>

            <button>
                <ArrowForwardIcon />
            </button>
            
        </div>
    );
}
export default GameItem;