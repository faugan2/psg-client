import "../styles/game_options_entry.scss";
import {useSelector,useDispatch} from "react-redux";
import {selectGameDate,selectLeaguePageOptions,setLeaguePageOptions} from "../features/counterSlice";
import {useState,useEffect} from "react";
const GameOptionsEntry=()=>{
    const league_page_options=useSelector(selectLeaguePageOptions);
    const [entry,set_entry]=useState(1);

    useEffect(()=>{
        set_entry(league_page_options.entry)
    },[league_page_options])

    useEffect(()=>{
        const line=document.querySelectorAll(".game_options_entry .line input[type=radio]");
        line[entry-1].checked=true;
    },[entry])
    const dispatch=useDispatch();

    const select_entry=(id)=>{
        const line=document.querySelectorAll(".game_options_entry .line input[type=radio]");
       line[id-1].checked=true;
       const new_league_options={...league_page_options,entry:id};
       dispatch(setLeaguePageOptions(new_league_options));

    }

    return(
        <div className="game_options_entry">
            <div className="line" onClick={select_entry.bind(this,1)}>
                <input type="radio" name="entry" defaultChecked /> 
                <button >All</button>
            </div>
            <div className="line" onClick={select_entry.bind(this,2)}>
                <input type="radio" name="entry" /> 
                <button >Free</button>
            </div>
            <div className="line"  onClick={select_entry.bind(this,3)}>
                <input type="radio" name="entry" /> 
                <button>1 Coin</button>
            </div>
            <div className="line" onClick={select_entry.bind(this,4)}>
                <input type="radio" name="entry" /> 
                <button >2 Coins</button>
            </div>
            <div className="line" onClick={select_entry.bind(this,5)}>
                <input type="radio" name="entry" /> 
                <button >5 Coins</button>
            </div>
        </div>
    );
}

export default GameOptionsEntry;