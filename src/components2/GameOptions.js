import "../styles/game_options.scss";
import MergeTypeIcon from '@material-ui/icons/MergeType';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SettingsBrightnessIcon from '@material-ui/icons/SettingsBrightness';
import CloseIcon from '@material-ui/icons/Close';
import {useState,useEffect} from "react";
import GameOptionsType from "./GameOptionsType";
import GameOptionsEntry from "./GameOptionsEntry";
import GameOptionsMode from "./GameOptionsMode";
import {useSelector} from "react-redux";
import {selectGameDate,selectTimeZone,selectLeaguePageResult} from "../features/counterSlice";
import AddIcon from '@material-ui/icons/Add';
import HeaderBottomSheet from "./HeaderBottomSheet";

const moment=require("moment-timezone");

const GameOptions=({click,tab})=>{
    const [page,set_page]=useState(1);
    const [date,set_date]=useState("");
    const game_date=useSelector(selectGameDate);
    const tz=useSelector(selectTimeZone);
    const result=useSelector(selectLeaguePageResult);
   

    const change_option=(id)=>{
        const btns=document.querySelectorAll(".game_options_footer>button");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.remove("active");
        }
        btns[id-1].classList.add("active");
        set_page(id);
    }

    useEffect(()=>{
        let d=game_date._d;
        if(d==undefined){
            d=game_date;
        }
        const new_date=moment.tz(d,tz).format("ll");
        set_date(new_date);

    },[game_date]);

    useEffect(()=>{
        const btns=document.querySelectorAll(".game_options_footer >button");
        btns[tab-1].click();
    },[tab])
    return(
        <div className="game_options">
            
            

            <div className="game_options_top">
                <button>
                    <p>{date}</p>
                    <p>Dates</p>
                </button>
                <button>
                    <p>{result}</p>
                    <p>Results</p>
                </button>
               
            </div>

            {page==1 && <GameOptionsType />}
            {page==2 && <GameOptionsEntry />}
            {page==3 && <GameOptionsMode />}
          
            <div className="game_options_footer">
                <button className="active" onClick={change_option.bind(this,1)}>
                    <MergeTypeIcon style={{fontSize:"1.2rem"}} />
                    Type
                </button>
                <button onClick={change_option.bind(this,2)}>
                    <AttachMoneyIcon style={{fontSize:"1.2rem"}}/>
                    Entry
                </button>
                <button onClick={change_option.bind(this,3)}>
                    <SettingsBrightnessIcon style={{fontSize:"1.2rem"}} />
                    Mode
                </button>
            </div>

            <HeaderBottomSheet title="Game Options">
                <button onClick={click} className="close_btn">
                    <CloseIcon style={{fontSize:"1.2rem"}}/>
                </button>
            </HeaderBottomSheet>
        </div>
    )
}

export default GameOptions;
