import "../styles/game_liste.scss";
import {useState,useEffect,} from "react";
import {useHistory} from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {selectSport,selectTournaments,selectLeagues,setLine} from "../features/counterSlice";
import GameItem from "./GameItem";

const GameListe=()=>{
    const s=useSelector(selectSport);
    const t=useSelector(selectTournaments);
    const l=useSelector(selectLeagues);

    const dispatch=useDispatch();
    const history=useHistory();

    const [games,set_games]=useState([]);

    useEffect(()=>{
        if(s==null || t==null || l==null) return;
        const res=t.filter((item)=>{
            return item.sport==s.id && item.parent==true;
        })

        set_games(res);
       
    },[t,s,l]);


    const go_to_game_lines=(line)=>{
        dispatch(setLine(line));
        history.push("/game-lines");
    }
   // //console.log("all t",t);
    return (
        <div className="game_liste">
            {games.length==0 && 
                <div className="empty">
                    <p>No data found</p>
                </div>
            }

            {games.length>0 && 
            <h1>Pick a type of challenge to continue</h1>
            }
            {
                games.length>0 && 
            
            <div className="games">
                
            {games.map((game)=>{
                return(
                    <GameItem game={game} key={game.key} click={go_to_game_lines.bind(this,game)} />
                );
            })}
            </div>
        }
            
        </div>
    )
}

export default GameListe;