import "../styles/line.scss";
import {useEffect, useState,useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectGameDate,selectTimeZone,selectPicks} from "../features/counterSlice";
import {auth, db} from "../firebase_file";
import VisibilityIcon from '@material-ui/icons/Visibility';

const moment=require("moment-timezone");
const Line=({line,click,no_games})=>{
    console.log("no games is ",line.key,no_games)
    //console.log(line.key);

    const picks=useSelector(selectPicks);

    const ref=useRef();

   const [total_players,set_total_players]=useState("");
   const [players,set_players]=useState("");
   const [btn_disabled,set_btn_disabled]=useState(false);
   const [status,set_status]=useState(no_games==true?"Open":"Closed");
   const [join,set_join]=useState("Join");
   const [joined,set_joined]=useState(false);

   const key=line.key;
   const type=line.type;
   
   

   useEffect(()=>{
    if(line==null) return; 
    if(line.type=="2"){
        set_total_players("/2");
    }else if(line.type=="3"){
        set_total_players("/10");
    }else if(line.type=="4"){
        set_total_players("");
    }

    const res=picks.filter((item)=>{
        return item.id_challenge==line.key;
    })

    set_players(res.length)

    
    const res2=res.map((item)=>{
        return item.user;
    })
    if(res2.indexOf(auth?.currentUser.email)>=0){
        set_join("View");
        set_joined(true);
        //ref.current.dataset.joined=true;
        ref.current.dataset.id_challenge=line.key;
    }else{
       // ref.current.dataset.joined=false;
        ref.current.dataset.id_challenge=line.key;
    }
   },[line,picks])

   useEffect(()=>{
        if(total_players=="" || players=="") return;
        const tp=parseInt(total_players.replace("/",""));
        const p=parseInt(players);

        if(tp==p){
            set_players(tp);
            set_status("Closed");
        }else{ 
            set_players(p);
        }
   },[total_players])

   /*useEffect(()=>{
    if(no_games==true){
        set_status("Closed");
        
        if(joined==false){
            console.log("oh here we go",ref.current);
            //ref.current.disabled=true; 
           // btn[1].style.border="1px solid red";
        }
        
    }
   },[joined,no_games])*/

  
   
    return(

        
        <div className="line_join2" >
            <div>
                <p>{line?.name}</p>
                <p className={status.toLowerCase()}>{status}</p>
            </div>
            <div>
                <p>Players</p>
                <p>{players}{total_players}</p>
            </div>
            
            
            <button 
             className={`${joined==true? "joined_game":"not_joined"} ${no_games==true?"no_games_true":"no_games_false"}`}
             data-joined={joined}

            ref={ref} onClick={e=>{
                click(joined,line)
            }}>
               {joined==true && <VisibilityIcon 
               
               style={{fontSize:"1.2rem"}}/>}
                {joined == false && join }
               
                
            </button>

        
        </div>
    )
}

export default Line;