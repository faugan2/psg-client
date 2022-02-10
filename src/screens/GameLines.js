import "../styles/game_lines.scss";
import {useSelector,useDispatch} from "react-redux";
import {selectLine, selectTournaments, selectTimeZone, setGameDate,selectGameDate, setJoin, setSelectedPicks, selectSendingPicks, setViewChallenge} from "../features/counterSlice";
import {useEffect, useState,useRef} from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {baseball,basketball,hockey,football} from "../components/data";
import {useHistory} from "react-router-dom";
import Line from "../components2/Line";
import DatePicker from "../components2/DatePicker";
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from "firebase";
import {db} from "../firebase_file";
import { BottomSheet,BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import LineJoin from "../components2/LineJoin";
import SendingPicks from "../components/SendingPicks";
import Joined from "../components2/Joined";

const moment=require("moment-timezone");
const GameLines=()=>{

    const sheetRef = useRef();

    const line=useSelector(selectLine);
    const t=useSelector(selectTournaments);
    const tz=useSelector(selectTimeZone);
    const game_date=useSelector(selectGameDate);

   


    const [game,set_game]=useState(null);
    const [type,set_type]=useState("");
    const [mode,set_mode]=useState("");
    const [entry,set_entry]=useState("");
    const [nb_game,set_nb_game]=useState("");
    const [data,set_data]=useState([]);
    const [date,set_date]=useState(new Date())
    const [create,set_create]=useState(false);
    const [creating,set_creating]=useState(false);
    const [open,set_open]=useState(false);
    const [open_sending,set_open_sending]=useState(false);
    const [open_joined,set_open_joined]=useState(false);
    
    const history=useHistory();
    const dispatch=useDispatch();

    useEffect(()=>{
        set_date(game_date);
    },[game_date])
    
    useEffect(()=>{
        //console.log(line);
        if(line==null) {
            history.replace("/");
            return;
        }
        set_game(line);

        if(line.type=="2"){
            set_type("Heads Up");
        }else if(line.type=="3"){
            set_type("Sports Booth");
        }else{
            set_type("Tournament");
        }

        if(line.mode=="1"){
            set_mode("MW");
        }else {
            set_mode("LWS")
        }

        if(line.entry=="0"){
            set_entry("Free")
        }else{
            set_entry(line.entry+" Coins");
        }

        set_nb_game(line.number_game);
    },[line]);



    useEffect(()=>{
        if(line==null) return;
        const game_type=line.type;
        const game_mode=line.mode;
        const game_entry=line.entry;
        const game_number=line.number_game;
        const game_league=line.league;

        const res=t.filter((item)=>{
            const line_date=moment.tz(item.date?.seconds*1000,tz);
            const diff=line_date.diff(moment.tz(date,tz),"days");
            

            return item.type==game_type && 
                item.mode==game_mode && 
                item.entry==game_entry && 
                item.number_game==game_number && 
                item.parent==false  &&
                item.league==game_league && 
                item.challenged!=true   && 
                item.winners==undefined   && 
                diff==0   
            ;
        })

        
        

        
        set_data(res);
        set_create(false);
        set_creating(false);
        if(res.length==0){
            set_create(true);
        }


        
    },[t,line,date]);



    const go_back=()=>{
        history.goBack();
    }

    const selectedDay = (val) =>{
        
       const today=moment.tz(new Date(),tz);
       const converted_val=moment.tz(val,tz);
       if(today.format("ll")==converted_val.format("ll")){
            set_date(today);
            dispatch(setGameDate(today))
       }else{
            set_date(val);
            dispatch(setGameDate(val))
       }
       
      
      };

      useEffect(()=>{
        if(create==false) return;
        if(creating==true) return;
        

        const new_line={
            ...line,
            date:firebase.firestore.Timestamp.fromDate(date),
            parent:false,
        };
        delete new_line.key;
        delete new_line.wins;
        delete new_line.winners;
        delete new_line.fee;
        console.log("creating...");
        set_creating(true);
        
        db.collection("psg_challenges").add(new_line).then(()=>{
            console.log("created");
            set_create(false);
            set_creating(false);
        }).catch((err)=>{
            console.log("error while creating");
            set_creating(false);
            set_create(true);
        })

        
      },[create])

     

      const close_modal=()=>{
          set_open(false);
          dispatch(setSelectedPicks([]));
      }
      const close_sending_picks=()=>{
          set_open_sending(false);
          dispatch(setSelectedPicks([]));
      }

      const closed_joined=()=>{
          set_open_joined(false);
      }
      const join=(e,line)=>{
        const btn=e.target;
        const joined=btn.dataset.joined;
       
        if(joined=="true"){
            dispatch(setViewChallenge(line.key))
            set_open_joined(true);

            return;
        }

       
        dispatch(setJoin(line))
        dispatch(setSelectedPicks([]));
        set_open(true);
      }

      useEffect(()=>{
        if(open_sending==true){
            set_open(false);
        }
      },[open_sending])

      const sp=useSelector(selectSendingPicks);
      useEffect(()=>{
        set_open_sending(sp);
      },[sp])
     
    return(
        <div className="game_lines">
            <div className="head">
                <button onClick={go_back}>
                    <ArrowBackIcon />
                </button>
                {line?.sport=="2" && <img src={basketball} />}
                {line?.sport=="6" && <img src={baseball} />}
                {line?.sport=="1" && <img src={football} />}
                {line?.sport=="3" && <img src={hockey} />}
                <p>{type}</p>
                <div className="separator" />
                <p>{mode}</p>
                <div className="separator" />
                <p>{entry}</p>
                <div className="separator" />
                <p>{nb_game} Games</p>
            </div>
            <div className="body">

            {
                creating==true && <div className="empty">
                    <p>Please wait...</p>
                    <CircularProgress size={15} style={{color:"black"}}/>
                </div>
            }

            {
                data.map((item)=>{
                    return(
                        <Line key={item.key} line={item} click={join}/>
                    );
                })
            }

          
            </div>
            <div className="game_line_footer">
                <DatePicker 
                date={date}
                selectedDay={selectedDay}
                 />
            </div>

           
                <BottomSheet  open={open}>
                    <LineJoin click={close_modal} />
                </BottomSheet>

                <BottomSheet  open={open_sending}>
                    <SendingPicks click={close_sending_picks} />
                </BottomSheet>

                <BottomSheet  open={open_joined}>
                    <Joined click={closed_joined} />
                </BottomSheet>
        </div>
    );
}
export default GameLines;