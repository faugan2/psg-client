import "../styles/game_options_mode.scss";
import {useSelector,useDispatch} from "react-redux";
import {selectGameDate,selectLeaguePageOptions,setLeaguePageOptions} from "../features/counterSlice";
import {useState,useEffect} from "react";
const GameOptionsMode=()=>{
    const league_page_options=useSelector(selectLeaguePageOptions);

    const [mode,set_mode]=useState(1);
    useEffect(()=>{
        set_mode(league_page_options.mode);
    },[league_page_options])

    useEffect(()=>{
        const line=document.querySelectorAll(".game_options_mode .line input[type=radio]");
       line[mode-1].checked=true;
    },[mode])

    
    const dispatch=useDispatch();

    const select_mode=(id)=>{
        const line=document.querySelectorAll(".game_options_mode .line input[type=radio]");
       line[id-1].checked=true;
       const new_league_options={...league_page_options,mode:id};
       dispatch(setLeaguePageOptions(new_league_options));

    }
    return(
        <div className="game_options_mode">
            <div className="line" onClick={select_mode.bind(this,1)}>
                <input type="radio" name="mode" defaultChecked />
                <button >All</button>
            </div>
            <div className="line" onClick={select_mode.bind(this,2)}>
                <input type="radio" name="mode" /> 
                <button >Most Wins</button>
            </div>
            <div className="line" onClick={select_mode.bind(this,3)}>
                <input type="radio" name="mode" /> 
                <button>Longest Winning Streak</button>
            </div>
            
        </div>
    );
}
export default GameOptionsMode;