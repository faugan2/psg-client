import "../styles/game_options_type.scss";
import { useSelector,useDispatch } from "react-redux";
import { selectLeaguePageOptions,setLeaguePageOptions } from "../features/counterSlice";
import {useState,useEffect} from "react";

const GameOptionsType=()=>{
    const league_page_options=useSelector(selectLeaguePageOptions);
    const [type,set_type]=useState(1);

    const dispatch=useDispatch();

    useEffect(()=>{
        set_type(league_page_options.type);
    },[league_page_options])

    const select_type=(id)=>{
        const line=document.querySelectorAll(".game_options_type .line input[type=radio]");
       line[id-1].checked=true;
       const new_league_options={...league_page_options,type:id};
       dispatch(setLeaguePageOptions(new_league_options));

    }

    useEffect(()=>{
        const line=document.querySelectorAll(".game_options_type .line input[type=radio]");
        line[type-1].checked=true;
    },[type])
    return(
        <div className="game_options_type">
             <div className="line" onClick={select_type.bind(this,1)}>
                <input type="radio" name="type" defaultChecked /> 
                <button >All</button>
            </div>
            <div className="line" onClick={select_type.bind(this,2)}>
                <input type="radio" name="type" /> 
                <button >Heads Up</button>
            </div>
            <div className="line"  onClick={select_type.bind(this,3)}>
                <input type="radio" name="type" /> 
                <button>Sports Booth</button>
            </div>
            <div className="line" onClick={select_type.bind(this,4)}>
                <input type="radio" name="type" /> 
                <button >Tournament</button>
            </div>
        </div>
    );
}

export default GameOptionsType;