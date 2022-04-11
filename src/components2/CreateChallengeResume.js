import "../styles/create_challenge_resume.scss";
import {useSelector,useDispatch} from "react-redux";
import {selectCreateChallengeOptions,selectUsers,selectLeagues,
    selectSendingPicks,
    setSendingPicks,
    selectTimeZone,setJoin} from "../features/counterSlice"
import NearMeIcon from '@material-ui/icons/NearMe';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import {useState,useEffect} from "react";
import {auth,db} from "../firebase_file";
import firebase from "firebase";
import CircularProgress from '@material-ui/core/CircularProgress';
import { BottomSheet } from 'react-spring-bottom-sheet'
import LineJoin from "./LineJoin";
import SendingPicks from "./SendingPicks";
import {useHistory} from "react-router-dom";



const moment=require("moment-timezone");

const CreateChallengeResume=({click,open_create_modal,open_join})=>{
    const dispatch=useDispatch();

    const options=useSelector(selectCreateChallengeOptions);
    const all_users=useSelector(selectUsers);
    const leagues=useSelector(selectLeagues);
    const tz=useSelector(selectTimeZone);
   


    const [users,set_users]=useState([]);
    const [league_name,set_league_name]=useState("");
    const [game_type,set_game_type]=useState("");
    const [game_mode,set_game_mode]=useState("");
    const [game_entry,set_game_entry]=useState("");
    const [game_number,set_game_number]=useState("");
    const [dates,set_dates]=useState("");
    const [creating,set_creating]=useState(false);

   

    

    useEffect(()=>{
        if(options==null) return;
        let u=options.users;
        if(u==undefined){
           u=[];
          
        }
        const res=all_users.filter((item)=>{
            return u.indexOf(item.key)>=0;
        })
        set_users(res);

        const l=options.id_league;
        const res2=leagues.filter((item)=>{
            return item.id==l;
        })
        if(res2.length>0){
            set_league_name(res2[0].name)
        }

        if(options.type==1){
            set_game_type("Heads Up");
        }else if(options.type==2){
            set_game_type("Sports Booth")
        }else if(options.type==3){
            set_game_type("Tournament");
        }
        if(options.mode==1){
            set_game_mode("Most Wins");
        }else{
            set_game_mode("Longest Winning Streak");
        }

        if(options.entry==1){
            set_game_entry("Free");
        }else if(options.entry==2){
            set_game_entry("1 Coin")
        }else if(options.entry==3){
            set_game_entry("2 Coins");
        }else if(options.entry==4){
            set_game_entry("5 Coins")
        }

        if(options.number_game==1){
            set_game_number(3)
        }else if(options.number_game==2){
            set_game_number(5)
        }else if(options.number_game==3){
            set_game_number(7)
        }else if(options.number_game==4){
            set_game_number(9)
        }

        let d=options.date;
        if(d==undefined){
            d=[];
        }
        d=d.join("; ");
        set_dates(d);

    },[options,all_users])
    
    const create_challenge=()=>{
        
        const {date,entry,id_league,id_sport,mode,number_game,single,type,users}=options;
        let str_entry="";
        if(entry==1){
            str_entry="0"
        }else if(entry==2){
            str_entry="1";
        }else if(entry==3){
            str_entry="2";
        }else if(entry==4){
            str_entry="5";
        }

        let str_type="";
        if(type==1){
            str_type="2";
        }else if(type==2){
            str_type="3";
        }else if(type==3){
            str_type="4";
        }

       
       let str_nb_game="";
       if(number_game==1){
           str_nb_game=3;
       }else if(number_game==2){
           str_nb_game=5;
       }else if(number_game==3){
           str_nb_game=7;
       }else if(number_game==4){
           str_nb_game=9;
       }


       const today=moment();
       const all_dates=[];
       for(var i=0; i<date.length; i++){
           const dt=moment.tz(date[i],tz);
           const diff=dt.diff(today,"hours");
           const line={date:dt.format("ll"),diff}
           all_dates.push(line)
       }

       const all_dates_ordered=all_dates.sort(order_by_diff);

       const start=all_dates_ordered[0].date;
       

       let new_users=users;
       if(users==undefined){
           new_users=[];
       }
        const challenge={
            entry:str_entry,
            league:id_league,
            sport:id_sport,
            type:str_type,
            mode,
            parent:false,
            number_game:str_nb_game,
            challenge:true,
            invites:new_users,
            single,
            user:auth?.currentUser.email,
            dates:date,
            date:firebase.firestore.Timestamp.fromDate(new Date(start)),
            name:auth?.currentUser?.displayName+" | "+league_name
            
        }
        console.log("the new challenge is ",challenge)
        set_creating(true);
        click();
        dispatch(setSendingPicks(true));
        db.collection("psg_challenges").add(challenge).then((res)=>{
            const join={...challenge,key:res.id}
            dispatch(setJoin(join));
            set_creating(false);
            dispatch(setSendingPicks(false)); 
            open_join();
            //set_open(true);

        }).catch((err)=>{
            console.log("une erreur",err.message);
            set_creating(false);
        })
    }

    const order_by_diff=(a,b)=>{
        if(a<b){
            return 1;
        }else{
            return -1;
        }
    }

    
    
   
    
    return(
        <div className="create_challenge_resume">
            <div className="resume_top">
                <h1>Your Challenge's Resume</h1>
            </div>
            <div className="resume_content">
                <div className="line">
                    <p>Sport : </p>
                    <p>{league_name}</p>
                </div>
                <div className="line">
                    <p>Type : </p>
                    <p>{game_type}</p>
                </div>
                <div className="line">
                    <p>Mode : </p>
                    <p>{game_mode}</p>
                </div>
                <div className="line">
                    <p>Entry fee : </p>
                    <p>{game_entry}</p>
                </div>
                <div className="line">
                    <p>Number of Games : </p>
                    <p>{game_number}</p>
                </div>

                <div className="line">
                    <p>Dates : </p>
                    <p>{dates}</p>
                </div>

                <div className="user_invited">
                    <h2>Friends Invited({users?.length})</h2>
                    <div className="all_friend_invited">
                        {
                            users.map((user)=>{
                                return(
                                    <button key={user.key}>
                                            <img src={user.photo} />
                                            <p>{user.username}</p>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
                
            </div>
            <div className="resume_bottom">
                <button onClick={click}>
                    <CloseIcon style={{fontSize:"1.2rem"}} />
                    Cancel
                </button>
                <button onClick={e=>{
                    click();
                    open_create_modal();
                }}>
                    <EditIcon style={{fontSize:"1.2rem"}} />
                    Edit Options</button>
                    
                    {creating==true && <button>
                        <CircularProgress style={{fontSize:"1.2rem",color:"white"}} size={15} />
                    </button>}

                    {creating==false && <button onClick={create_challenge}>
                        <NearMeIcon style={{fontSize:"1.2rem"}}/>
                        Create Now
                    </button>}
            </div>

            
            
        </div>
    );
}
export default CreateChallengeResume;