import "../styles/live.scss";
import {useEffect, useState} from "react"
import {useSelector,useDispatch} from "react-redux";
import {selectPicks, setViewChallenge} from "../features/counterSlice";
import {auth, db} from "../firebase_file";
import LiveItem from "./LiveItem";
import { selectSport,selectTournaments,selectLeagues,selectTimeZone,selectSports } from "../features/counterSlice";
import { BottomSheet,BottomSheetRef } from 'react-spring-bottom-sheet'
import Joined from "./Joined";

const moment=require("moment-timezone");

const Live=()=>{

    const picks=useSelector(selectPicks);
    const sport=useSelector(selectSport);
    const sports=useSelector(selectSports);
    const tournaments=useSelector(selectTournaments);
    const l=useSelector(selectLeagues);
    const tz=useSelector(selectTimeZone);

    const dispatch=useDispatch();

    
    const [my_picks,set_my_picks]=useState([]);
    const [leagues,set_leagues]=useState([]);


    useEffect(()=>{
        const res=picks.filter((item)=>{
            const user=item.user;
            return user==auth?.currentUser.email;
        })

        
        
        
        const id_sport=sport?.id;
        const res_league=l.filter((item)=>{
            return item.id_sport==id_sport;
        })
       let all_leagues=res_league.map((item)=>{
           return item.id;
       });

     if(sport==null && all_leagues.length==0){
         all_leagues=l.map((item)=>{
             return item.id;
         });
     }

     console.log("all leagues are ",all_leagues);

      
      

       const res2=res.filter((item)=>{
           const id_challenge=item.id_challenge;
          
           const challenge_info=tournaments.filter((item2)=>{
               
               return item2.key==id_challenge && item2.winners ==undefined;
           })
           
           
           
           if(challenge_info.length>0){
               const challenge_league=challenge_info[0].league;
               console.log(challenge_league);
               
               return all_leagues.indexOf(challenge_league)>=0;
           }else{
               return null;
           }

       })

       const dates=[];
      const res3=res2.map((item)=>{
          const date=moment.tz(item.date*1000,tz).format("ll");
          if(dates.indexOf(date)<0){
            dates.push(date)
          }
         
      })

      const data=[];
      for(var i=0; i<dates.length; i++){
          const d=dates[i];
          const res4=res2.filter((item)=>{
               // console.log("the item is ",item);
                const date=moment.tz(item.date*1000,tz).format("ll");
                return date==d;
          })

          data.push({date:d,picks:res4})
      }
       set_my_picks(data);
        
    },[picks,tournaments,sport,l]);

    const live_detail=(key)=>{
        
        dispatch(setViewChallenge(key));
        set_open_detail(true);
    }

    const [open_detail,set_open_detail]=useState(false);
    const close_detail=()=>{
        set_open_detail(false);
    }

   
    return (
        <div className="live">
            {
                my_picks.length==0 && 
                <div className="info">
                    <p>No data found in live</p>
                </div>
            }

            {
                my_picks.length>0 && 
                <div className="live_body">
                    {
                        my_picks.map((line,i)=>{
                            const date=line.date;
                            const picks=line.picks;
                            return(
                                <div key={i}>
                                    <p>{date}</p>
                                    {
                                        picks.map((pick,j)=>{
                                            return(
                                                <LiveItem pick={pick} 
                                                key={j} click={live_detail}/>
                                            )
                                        })
                                    }
                                </div>
                            );
                            
                        })
                    }
                </div>
            }

                <BottomSheet  open={open_detail}>
                    <Joined click={close_detail} />
                </BottomSheet>
        </div>
    )
}

export default Live;