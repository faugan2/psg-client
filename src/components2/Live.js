import "../styles/live.scss";
import {useEffect, useState} from "react"
import {useSelector,useDispatch} from "react-redux";
import {selectPicks, selectSendingPicks, setGameDate, setJoin, setLine, setSport, setViewChallenge} from "../features/counterSlice";
import {auth, db} from "../firebase_file";
import LiveItem from "./LiveItem";
import { selectSport,selectTournaments,selectLeagues,selectTimeZone,selectSports,selectMyInvites } from "../features/counterSlice";
import { BottomSheet,BottomSheetRef } from 'react-spring-bottom-sheet'
import Joined from "./Joined";
import Line from "./Line";


import LineJoin from "./LineJoin";
import SendingPicks from "./SendingPicks";
import UserProfile from "./UserProfile";

const moment=require("moment-timezone");

const Live=()=>{

    const picks=useSelector(selectPicks);
    const sport=useSelector(selectSport);
    const sports=useSelector(selectSports);
    const tournaments=useSelector(selectTournaments);
    const l=useSelector(selectLeagues);
    const tz=useSelector(selectTimeZone);
    const invites=useSelector(selectMyInvites)
    const sending=useSelector(selectSendingPicks);
    const s=useSelector(selectSports);

    const dispatch=useDispatch();

    
    
    const [my_picks,set_my_picks]=useState([]);
    const [leagues,set_leagues]=useState([]);
    const [open,set_open]=useState(false);
    const [open_sending,set_open_sending]=useState(false);
    const [open_profile,set_open_profile]=useState(false);
    const [invites_show,set_invites_show]=useState([]);

    const close_profile=()=>{
        set_open_profile(false);
    }

    const trigger_profile=()=>{
        set_open_profile(true);
    }


    useEffect(()=>{
        if(invites==null) return;
        //console.log("the invites is ",invites);
        const dates=invites.map((item)=>{
            const str_date=moment(item.date?.seconds*1000).endOf("day");
            const diff=str_date.diff(moment().endOf("day"),"seconds");
			//console.log("the diff is ",diff);
            if(diff>=0){
                return str_date.format("ll");
            }
            
        }).filter((item)=>{
            return item!=undefined;
        })
        //console.log("the dates is ",dates);

        const d=[];
        for(var i=0; i<dates.length; i++){
            var date=dates[i];
            const res=invites.filter((item)=>{
                const str_date=moment(item.date?.seconds*1000).endOf("day");
                
                return date==str_date.format("ll");
            })
            d.push({date,lines:res});
            
        }
        set_invites_show(d);

    },[invites]);

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

     //console.log("all leagues are ",all_leagues);

      
      

       const res2=res.filter((item)=>{
           const id_challenge=item.id_challenge;
          
           const challenge_info=tournaments.filter((item2)=>{
               
               return item2.key==id_challenge && item2.winners ==undefined;
           })
           
           
           
           if(challenge_info.length>0){
               const challenge_league=challenge_info[0].league;
               //console.log(challenge_league);
               
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
               // //console.log("the item is ",item);
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

    const click_to_join=(line)=>{
        //console.log("the line is ",line);
        const line_sport=line.sport;
        const sport=s.filter((item)=>{
            return item.id==line_sport;
        })[0];
       
        dispatch(setSport(sport));
        //console.log("the sport is ",sport)
        const date=moment.tz(line.date?.seconds*1000,tz);
        //console.log("the date is ",date);
        dispatch(setGameDate(date))
       dispatch(setLine(line));
        dispatch(setJoin(line))
        set_open(true);
    }

    const close_modal=()=>{
        set_open(false);
    }
    const close_sending_picks=()=>{
        set_open_sending(false);
    }

    useEffect(()=>{
        if(sending==true){
            set_open(false);
            set_open_sending(true);
        }else{
            set_open_sending(false);
        }
    },[sending]);
   
    return (
        <div className="live">

            {
                (invites_show != null && invites_show.length>0) && 
                    <div className="invites">
                        <h2>You are invited to join the following game(s):</h2>
                        {
                            invites_show.map((item,i)=>{
                                const {date,lines}=item;
                                return(
                                    <div key={i}>
                                        <p style={{
                                            color:"white",
                                            backgroundColor:"var(--sub_black)",
                                            width:"80px",
                                            margin:"auto",
                                            fontSize:"0.7rem",
                                            padding:"0.3rem",
                                            textAlign:"center",
                                            marginTop:"0.5rem",

                                            }}>{date}</p>
                                        {
                                            lines.map((line)=>{
                                                return(
                                                    <Line 
                                                        trigger_profile={trigger_profile}
                                                        line={line} key={line.key} 
                                                        click={click_to_join.bind(this,line)}
                                                        invited={true}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                )

                              
                            })
                        }
                    </div>
            }

            {
               (my_picks.length==0 && invites_show?.length==0) &&
                <div className="info">
                    <p>No data found in live</p>
                </div>
            }

            {
                my_picks.length>0 && 
                <div className="live_body">
                    <h2>You joined the following game(s):</h2>
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

                <BottomSheet  open={open}>
                    <LineJoin click={close_modal} />
                </BottomSheet>

                <BottomSheet  open={open_sending}>
                    <SendingPicks click={close_sending_picks} />
                </BottomSheet>

                <BottomSheet open={open_profile}>
                    <UserProfile click={close_profile}/>
                </BottomSheet>

                <div className="margin_bottom" ></div>
        </div>
    )
}

export default Live;