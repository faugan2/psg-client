import "../styles/user_profile_todays_game.scss";
import {useSelector, useDispatch} from "react-redux"
import {selectPicks,selectUsers,selectUserProfile,selectTournaments} from "../features/counterSlice";
import {useState,useEffect} from "react";
import { auth } from "../firebase_file";

import TodayGameItem from "./TodayGameItem";

const moment=require("moment-timezone");

const UserProfileTodaysGame=()=>{
    const picks=useSelector(selectPicks);
    const email=useSelector(selectUserProfile);
    const t=useSelector(selectTournaments);
    
    const [data,set_data]=useState([]);
    
    useEffect(()=>{
        if(email==null) return;
        if(picks==null) return;
        if(t==null) return;

       

        const res=picks.filter((item)=>{
            const date=item.date;
            const id_challenge=item.id_challenge;
            
            const challenge=t.filter((i)=>{
                return i.key==id_challenge;
            })[0] 
            
            return item.user==email && challenge.winners==undefined;
        })

        const res2=res.map((item)=>{
            const date=item.date;
            const picks=item.picks;
            const all_picks=picks.map((pick)=>{
                
                return {...pick,date}
            });
            return all_picks
        })
        
        
        const res3=[]
        
        res2.map((item)=>{
            for(var i=0;i<item.length; i++){
                res3.push({...item[i]})
            }
        })
       
        

        const deja=[];
        const res4=res3.filter((item)=>{
            const id_game=item.id_game;
            const type_pick=item.type_pick
            const key=`${id_game}_${type_pick}`;

            let already=false;
            if(deja.indexOf(key)>=0){
                already=true;
            }else{
                deja.push(key);
            }

            return !already;
        })


       set_data(res4);
       

        

    },[email,picks,t])

    const picks_ids=[];
    const do_not_show=[]

    return(
        <div className="user_profile_todays_game">
            {
                data.length==0 && 
                <div className="info">
                    <p>No data found</p>
                </div>
            }

            {
                data.length>0 && 
                <div className="games_today">
                    {
                     
                        data.map((game,i)=>{
                           
;                           
                            return(
                                <TodayGameItem key={i} item={game}/>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}
export default UserProfileTodaysGame;