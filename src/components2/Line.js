import "../styles/line.scss";
import {useEffect, useState,useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectGameDate,selectTimeZone,selectPicks,selectUsers,setUserProfile} from "../features/counterSlice";
import {auth, db} from "../firebase_file";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { baseball, basketball, counter_strike, csgo, dota2, football, hockey, league_of_legend, ncaab, ncaaf, overwatch, ufc } from "./data";
import logo from "./img/logo.png";

import {useTransition,animated} from "react-spring";

const moment=require("moment-timezone");
const Line=({line,click,no_games,show_details=false,invited,trigger_profile,show_btn_join,
show_btn_view,show_date})=>{
    

    const picks=useSelector(selectPicks);
    const users=useSelector(selectUsers);
    
    const dispatch=useDispatch();

    const ref=useRef();

   const [total_players,set_total_players]=useState("");
   const [players,set_players]=useState("");
   const [btn_disabled,set_btn_disabled]=useState(false);
   const [status,set_status]=useState("Open");
   const [join,set_join]=useState("Join");
   const [joined,set_joined]=useState(false);
   const [str_type,set_type]=useState("");
   const [str_mode,set_mode]=useState("");
   const [str_number_game,set_number_game]=useState("");
   const [str_entry,set_entry]=useState("");
   const [username,set_username]=useState("");
   const [photo,set_photo]=useState(null);
   const [user_email,set_user_email]=useState("");
   const [date,set_date]=useState("");

   const key=line.key;
   const type=line.type;
   
   

   useEffect(()=>{
    if(line==null) return; 
    if(line.type=="2"){
        set_total_players("/2");
        set_type("Heads Up");
    }else if(line.type=="3"){
        set_total_players("/10");
        set_type("Sports Booth");
    }else if(line.type=="4"){
        set_total_players("");
        set_type("Tournament");
    }

    if(line.mode==1){
        set_mode("MW")
    }else if(line.mode==2){
        set_mode("LWS")
    }
    set_number_game(line.number_game);
    
    if(line.entry=="0"){
        set_entry("Free")
    }else{
        let e=parseInt(line.entry);
        if(e>=1000){
            e/=1000;
        }
        set_entry(e);
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
        if(ref.current!=null){
            ref.current.dataset.id_challenge=line.key;
        }
        
    }else{
       // ref.current.dataset.joined=false;
       if(ref.current!=null){
            ref.current.dataset.id_challenge=line.key;
       }
        
    }

    if(invited==true){
        const u=users.filter((item)=>{
            return item.email==line.user;
        })

        if(u.length>0){
            set_username(u[0].username);
            set_photo(u[0].photo);
            set_user_email(u[0].email);
        }else{
            set_username("Prosport Guru .Inc");
            set_photo(logo);
            set_user_email("");
        }
    }

    set_date(moment(line.date.seconds*1000).format("ll"))

    
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
            //console.log("oh here we go",ref.current);
            //ref.current.disabled=true; 
           // btn[1].style.border="1px solid red";
        }
        
    }
   },[joined,no_games])*/
   //console.log("league is ",line.league);

  const visit_user_profile=(email)=>{
    if(email=="") return;
    dispatch(setUserProfile(email))
    trigger_profile();

  }

  const [show,set_show]=useState([1]);
  const transition=useTransition(show,{
      from:{
          opacit:0,
          x:0,
          y:500,
          
      },
      enter:{
          opacity:1,
          x:0,
          y:0
      },
      leave:{}
  })
   
    return(

        transition((style,item)=>{
            if(item){
                return(
                    <animated.div className="line_container" style={style} >
        <div className="line_join2" >
            <div>
                <p>{line?.name}</p>
                <p className={status.toLowerCase()}>{status}</p>
            </div>
            <div>
                <p>Players</p>
                <p>{players}{total_players}</p>
            </div>

            {
                show_date==true && 

                <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                    <p style={{color:"gray",fontWeight:"normal",fontSize:"0.6rem"}}>Date</p>
                    <p style={{color:"gray",fontWeight:"normal",fontSize:"0.6rem"}}>{date}</p>
                </div>
            }
            
            
            {show_btn_join==undefined && <button 
             
             data-joined={joined}

            ref={ref} onClick={e=>{
                click(joined,line)
            }}>
               {(joined==true || players==total_players.replace("/","")) && <VisibilityIcon 
               
               style={{fontSize:"1.2rem"}}/>}
                {(joined == false && players!=total_players.replace("/","") ) && join }
               
                
            </button>
            }
            </div>
            <div className="details">
                <div>
                {line.league==9 && <img src={baseball} />}
                {line.league==11 && <img src={overwatch} />}
                {line.league==8 && <img src={league_of_legend} />}
                {line.league==1 && <img src={ncaaf} />}
                {line.league==12 && <img src={ufc} />}
                {line.league==4 && <img src={ncaab} />}
                {line.league==10 && <img src={csgo} />}
                {line.league==7 && <img src={dota2} />}
                {line.league==2 && <img src={football} />}
                {line.league==3 && <img src={basketball} />}
                {line.league==5 && <img src={hockey} />}
                {line.league==6 && <img src={counter_strike} />}
                </div>
               <div>
                   <p>{str_type}</p>
                   <p>Type</p>
               </div>

               <div>
                   <p>{str_mode}</p>
                   <p>Mode</p>
               </div>

               <div>
                   <p>{str_number_game}</p>
                   <p>#Games</p>
               </div>

               <div>
                   <p>{str_entry}</p>
                   <p>Entry</p>
               </div>

            </div>
            {
                invited==true && 
                <div className="invited_user">
                   <p>Invitation sent by :</p>
                   <div onClick={visit_user_profile.bind(this,user_email)}>
                        <img src={photo} />
                        <p>{username}</p>
                    </div>
                </div>
            }

           
        </animated.div>
                )
            }
        })
        
    )
}

export default Line;