import "../styles/joined_configuration.scss";
import Joined from "./Joined";
import {useSelector,useDispatch} from "react-redux";
import {selectViewChallenge,selectTournaments,selectSports,selectLeagues,selectUsers,selectPicks,setLine,} from "../features/counterSlice";
import {auth} from "../firebase_file";
import {useState,useEffect} from "react";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { BottomSheet } from 'react-spring-bottom-sheet'
import JoinedInviteUser from "./JoinedInviteUser";

const moment=require("moment-timezone");

const JoinedConfiguration=()=>{

    const id_challenge=useSelector(selectViewChallenge);
    const t=useSelector(selectTournaments);
    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const u=useSelector(selectUsers);
    const p=useSelector(selectPicks);

    const dispatch=useDispatch();

    const [single,set_single]=useState(true);
    const [sport,set_sport]=useState("");
    const [league,set_league]=useState("");
    const [type,set_type]=useState("");
    const [mode,set_mode]=useState("");
    const [entry,set_entry]=useState("");
    const [winning,set_winning]=useState("");
    const [date,set_date]=useState("");
    const [invites,set_invites]=useState([]);
    const [creator,set_creator]=useState("");
    const [joined_users,set_joined_users]=useState([]);
    const [open,set_open]=useState(false);


    useEffect(()=>{
        const res=t.filter((item)=>{
            return item.key==id_challenge;
        })
       
        if(res.length>0){
            const line=res[0];
            dispatch(setLine(line));
            
            const line_sport=line.sport;
            const sport_name=s.filter((item)=>{
                return item.id==line_sport;
            })[0].name;
            set_sport(sport_name);

            const line_league=line.league;
            const league_name=l.filter((item)=>{
                return item.id==line_league;
            })[0].name;
            set_league(league_name);

            const line_type=line.type;
            let players=0;
            if(line_type=="2"){
                set_type("Heads Up");
                players=2;
            }else if(line_type=="3"){
                set_type("Sports Booth");
                players=10
            }else if(line_type=="4"){
                set_type("Tournament");
                players=11;
            }

            if(line.mode=="1"){
                set_mode("Most Wins")
            }else if(line.mode=="2"){
                set_mode("Longest Winning Streak");
            }

            if(line.entry=="0"){
                set_entry("Free");
            }else {
                set_entry(line.entry+" Coins");
            }

            if(line.entry=="0"){
                set_winning("0");
            }else{
                set_winning(line.entry+" x #players");
            }
            //console.log(line);
            if(line.single!=undefined){
                set_single(line.single);
                set_date(line.dates.join(" ; "));
            }else{
                const d=moment(line.date?.seconds*1000).format("ll");
                set_date(d);
            }

            const users=line.invites;
            if(users!=undefined){

                const all_users=u.filter((item)=>{
                    return users.indexOf(item.key)>=0;
                })
                console.log("all users are ",all_users);
                set_invites(all_users);

            }
            
            const res2=line.user;
            const res3=u.filter((item)=>{
                return item.email==res2;
            })
            if(res3.length>0){
                set_creator(res3[0].username)
            }

            const res4=p.filter((item)=>{
                return item.id_challenge==id_challenge
            })

            const res5=res4.map((item)=>{
                return item.user;
            })

            set_joined_users(res5)
            console.log(res5);
            

            
        }
    },[id_challenge,t])

    const close_modal=()=>{
        set_open(false);
    }

    const invite_new_users=()=>{
        set_open(true);
    }
    
    return(
        <div className="joined_configuration">
            <div className="line">
                <p>Sport</p>
                <p>{sport} / {league}</p>
            </div>

            <div className="line">
                <p>Type</p>
                <p>{type}</p>
            </div>

            <div className="line">
                <p>Mode</p>
                <p>{mode}</p>
            </div>
            <div className="line">
                <p>Entry</p>
                <p>{entry}</p>
            </div>
            <div className="line">
                <p>Winning</p>
                <p>{winning}</p>
            </div>
            <div className="line">
                <p>
                    {single==true && "Single Date"}
                    {single==false && "Multiple Dates"}
                </p>
                <p>{date}</p>
            </div>

            <div className="line">
                <p>Created By</p>
                <p>{creator}</p>
            </div>

            <div className="invited_users">
                <h2 style={{display:"none"}}>
                    Invited users
                    <button onClick={invite_new_users}>
                        <PersonAddIcon style={{fontSize:"1.2rem",color:"white"}} />
                    </button>
                </h2>

                {
                    invites.length>0 && 
                    <div className="all_users">
                        {
                            invites.map((user)=>{
                                return(
                                    <button key={user.key}>
                                        <img src={user.photo} />
                                        {user.username}
                                        
                                        {
                                            joined_users.indexOf(user.email)>=0 && 
                                            <div>
                                                <DoneAllIcon style={{fontSize:"1.2rem",color:"green"}} />
                                                <p className="accepted">Joined</p>
                                            </div>
                                            
                                        }

                                        {
                                            joined_users.indexOf(user.email)<0 && 
                                            <div>
                                                <DoneAllIcon style={{fontSize:"1.2rem"}} />
                                                <p className="pending">Pending</p>
                                            </div>
                                            
                                        }
                                        
                                    </button>
                                )
                            })
                        }
                    </div>
                }
               
            </div>

            <BottomSheet open={open}>
                <JoinedInviteUser click={close_modal}/>
            </BottomSheet>
        </div>
    )
}

export default JoinedConfiguration;