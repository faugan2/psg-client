import "../styles/league_page.scss";
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectSport,selectLeague,setGameDate,selectLeaguePageOptions, setCreateChallengeOptions,
selectCreateChallengeOptions,selectSendingPicks,setSendingPicks,
selectPicks,selectNotEnoughCoins
} from "../features/counterSlice";
import { useHistory  } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
    basketball,
    baseball,overwatch,
    league_of_legend,
    ncaaf,ufc,ncaab,csgo,
    dota2,
    football,
    hockey,
    counter_strike,
    
    } from "../components2/data";
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import Picker from "../components2/DatePicker";
import GameOptions from "../components2/GameOptions";
import { BottomSheet} from 'react-spring-bottom-sheet'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CreateChallenge from "../components2/CreateChallenge";
import CreateChallengeResume from "../components2/CreateChallengeResume";

import LineJoin from "../components2/LineJoin";
import SendingPicks from "../components2/SendingPicks";
import LeaguePageContent from "../components2/LeaguePageContent";
import NotEnoughCoins from "../components2/NotEnoughCoins";

const moment=require("moment-timezone");

const LeaguePage=()=>{
    const league=useSelector(selectLeague);
    const league_options=useSelector(selectLeaguePageOptions);
    const create_options=useSelector(selectCreateChallengeOptions);
    const sending=useSelector(selectSendingPicks);
    const picks=useSelector(selectPicks);
    const ne=useSelector(selectNotEnoughCoins);

    const history=useHistory();
    const dispatch=useDispatch();

    const [open_options,set_open_options]=useState(false);
    const [open_create,set_open_create]=useState(false);
    const [type,set_type]=useState("All type");
    const [mode,set_mode]=useState("All mode");
    const [entry,set_entry]=useState("All entry");
    const [tab,set_tab]=useState(1);
    const [open_create_resume,set_open_create_resume]=useState(false);
    const [open,set_open]=useState(false);
    const [open_sending,set_open_sending]=useState(false);
    const [open_not_enough,set_open_not_enough]=useState(false)

    const close_modal=()=>{
        set_open(false);
    }
    const close_sending_picks=()=>{
        set_open_sending(false);
    }
    const close_not_enough=()=>{
        set_open_not_enough(false);
    }

    useEffect(()=>{
        set_open_not_enough(ne);
    },[ne])


    useEffect(()=>{
        if(league_options==null){
            history.replace("/");
            return;
        }
        const t=league_options.type;
        //console.log("the type is ",t);
        if(t==1){
            set_type("All type");
        }else if(t==2){
            set_type("Heads Up");
        }else if(t==3){
            set_type("Sports Booth")
        }else if(t==4){
            set_type("Tournaments");
        }

        const m=league_options.mode;
        if(m==1){
            set_mode("All mode");
        }else if(m==2){
            set_mode("MW");
        }else if(m==3){
            set_mode("LWS");
        }

        const e=league_options.entry;
        //console.log("the entry is ",e);
        if(e==1){
            set_entry("All entry");
        }else if(e==2){
            set_entry("Free");
        }else if(e==3){
            set_entry("1 coin");
        }else if(e==4){
            set_entry("2 coins");
        }else if(e==5){
            set_entry("5 coins");
        }
    },[league_options]);

    const close_options=()=>{
        set_open_options(false);
    }
    const selectedDay=(val)=>{
        dispatch(setGameDate(val));
    }

    
    const open_game_options=(id)=>{
        set_open_options(true)
        set_tab(id);
    }

    const close_create=()=>{
        set_open_create(false);
    }

    const open_create_modal=()=>{
        set_open_create(true);
    }

    const btn_open_create=()=>{
        const date=moment().format("ll");
        
        set_open_create(true);
        if(create_options!=null){
            return;
        }
        dispatch(setCreateChallengeOptions({...league_options,entry:1,mode:1,type:1,single:true,date:[date]}));
    }

    const open_create_challenge_resume=()=>{
        set_open_create_resume(true);
    }
    const close_create_resume=()=>{
        set_open_create_resume(false);
    }

    useEffect(()=>{
        if(sending==true){
            set_open(false);
            set_open_sending(true);
        }else{
            set_open_sending(false);
        }
    },[sending]);

    const open_join_modal=()=>{
        set_open(true);
    }

    
    return (
        <div className="league_page">
           <div className="top_league_page">
               <button onClick={e=>history.goBack()}>
                    <ArrowBackIcon style={{color:"white"}}/>
               </button>
               {league?.id==9 && <img src={baseball} />}
                {league?.id==11 && <img src={overwatch} />}
                {league?.id==8 && <img src={league_of_legend} />}
                {league?.id==1 && <img src={ncaaf} />}
                {league?.id==12 && <img src={ufc} />}
                {league?.id==4 && <img src={ncaab} />}
                {league?.id==10 && <img src={csgo} />}
                {league?.id==7 && <img src={dota2} />}
                {league?.id==2 && <img src={football} />}
                {league?.id==3 && <img src={basketball} />}
                {league?.id==5 && <img src={hockey} />}
                {league?.id==6 && <img src={counter_strike} />}
               <h2>{league?.name}</h2>
               <div className="options">
                   <button onClick={open_game_options.bind(this,1)}>{type}</button>
                   <button onClick={open_game_options.bind(this,2)}>{entry}</button>
                   <button onClick={open_game_options.bind(this,3)}>{mode}</button>
               </div>
               <button onClick={e=>set_open_options(true)}>
                   <MoreVertIcon style={{color:"white"}}/>
               </button>
           </div>
           <div className="content_league_page">
               <LeaguePageContent />
           </div>
           
            <div className="option_league_page">
                <button onClick={btn_open_create}>
                     <AddIcon  />
                </button>
            </div>

            <div className="zone_date_picker">
                <Picker selectedDay={selectedDay}/>
            </div>

            <BottomSheet open={open_options}>
                <GameOptions click={close_options} tab={tab} />
            </BottomSheet>

            <BottomSheet open={open_create}>
                <CreateChallenge click={close_create}  resume={open_create_challenge_resume} />
            </BottomSheet>

            <BottomSheet open={open_create_resume}>
                <CreateChallengeResume click={close_create_resume} open_create_modal={open_create_modal} 
                open_join={open_join_modal}/>
            </BottomSheet>

            <BottomSheet  open={open}>
                    <LineJoin click={close_modal} />
                </BottomSheet>

                <BottomSheet  open={open_sending}>
                    <SendingPicks click={close_sending_picks} />
                </BottomSheet>

                <BottomSheet open={open_not_enough}>
                    <NotEnoughCoins click={close_not_enough}/>
                 </BottomSheet>
          
        </div>
    )
}

export default LeaguePage;