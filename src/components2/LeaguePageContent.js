import "../styles/league_page_content.scss";
import { useSelector,useDispatch } from "react-redux";
import { selectLeaguePageOptions,selectTournaments,selectTimeZone, 
    setViewChallenge,
    setJoin,
    selectSendingPicks,
    setSelectedPicks,
    setLeaguePageResult,
    selectPicks,
    selectLine,
    selectGameDate, 
    setLine} from "../features/counterSlice";
import {useState,useEffect} from "react";
import Line from "./Line";

import firebase from "firebase";
import {db,auth} from "../firebase_file";
import { BottomSheet,BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import LineJoin from "../components2/LineJoin";
import SendingPicks from "../components2/SendingPicks";
import Joined from "../components2/Joined";

const moment=require("moment-timezone")

const LeaguePageContent=()=>{
    const options=useSelector(selectLeaguePageOptions);
    const t=useSelector(selectTournaments);
    const tz=useSelector(selectTimeZone);
    const game_date=useSelector(selectGameDate);
    const picks=useSelector(selectPicks);
    const line=useSelector(selectLine);

    const dispatch=useDispatch();

    const [data,set_data]=useState([]);
    const [create,set_create]=useState(false);
    const [creating,set_creating]=useState(false);
    const [open,set_open]=useState(false);
    const [open_sending,set_open_sending]=useState(false);
    const [open_joined,set_open_joined]=useState(false);
    const [no_games,set_no_games]=useState(false);

    const join=(joined,line)=>{
        console.log(joined,line)
        const id_ch=line.key;
        const type_ch=line.type;
        let total_players=0;
        if(type_ch=="2"){
            total_players=2;
        }else if(type_ch=="3"){
            total_players=10;
        }else{
            total_players=100;
        }

        const players=picks.filter((item)=>{
            return item.id_challenge==id_ch;
        }).length;
        

        if(players==total_players){
            dispatch(setViewChallenge(line.key))
            set_open_joined(true);
            return;
        }
        
        
        if(joined==true){
            dispatch(setViewChallenge(line.key))
            set_open_joined(true);
            return;
        }

       
        dispatch(setJoin(line))
        dispatch(setSelectedPicks([]));
        set_open(true);
    }
    
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

    useEffect(()=>{
        if(open_sending==true){
            set_open(false);
        }
      },[open_sending])

      const sp=useSelector(selectSendingPicks);
      useEffect(()=>{
        set_open_sending(sp);
      },[sp])

    useEffect(()=>{
        
        if(options==null ) return;

        let d=game_date._d;
        if(d==undefined){
            d=game_date;
        }
        d=moment.tz(d,tz);

        

        let str_type="";
        let str_mode="";
        let str_entry="";

        const {type,mode,entry}=options;
        if(type==1){
            str_type="";
        }else{
            str_type=type;
        }

        if(mode==1){
            str_mode="";
        }else if(mode==2){
            str_mode="1";
        }else if(mode==3){
            str_mode="2";
        }

        if(entry==1){
            str_entry="";
        }else if(entry==2){
            str_entry="0"
        }else if(entry==3){
            str_entry="1"
        }else if(entry==4){
            str_entry="2"
        }else if(entry==5){
            str_entry="5"
        }
        
        const res=t.filter((item)=>{
            const date=moment.tz(item.date?.seconds*1000,tz);
           
            return item.parent==false && 
            item.sport==options.id_sport && 
            item.league==options.id_league && 
            date.format("ll")==d.format("ll") && 
            (str_entry=="" || str_entry==item.entry) && 
            (str_type=="" || str_type==item.type) && 
            (str_mode=="" || str_mode==item.mode)
            
        })

        const res_1=t.filter((item)=>{
            return item.parent==true && 
            item.sport==options.id_sport && 
            item.league==options.id_league 
            
        })


        if(res_1.length>0){
            const index=Math.round(Math.random()*(res_1.length-1));
            const l=res_1[index];
            dispatch(setLine(l));
        }
        
       


        const res2=res.map((item)=>{
            const id_challenge=item.key;
            const r=picks.filter((i)=>{
                return i.id_challenge==id_challenge;
            })
            if(r.length==0){
                return item;
            }else{
                return null;
            }
        })
        const res3=res2.filter((item)=>{
            return item!=null;
        })

        

        
        const res4=res.map((item)=>{
            const r2=picks.filter((i)=>{
                return i.id_challenge==item.key;
            })
            if(r2.length==0){
                return item;
            }
        }).filter((item)=>{
            return item!=undefined;
        })

        const res5=res.map((item)=>{
            const r2=picks.filter((i)=>{
                return i.id_challenge==item.key;
            })
            if(r2.length>0){
                return item;
            }
        }).filter((item)=>{
            return item!=undefined;
        })

        

       // console.log("element with no picks",res4);
        //console.log("element with picks",res5);
        const res6=[...res4,...res5];
        
        let not_in=true;
        const email=auth?.currentUser.email;
        const res7=res6.filter((item)=>{
            const id_ch=item.key;
            const res7_1=picks.filter((i)=>{
                return i.id_challenge==id_ch;
            })

            const all_users=res7_1.map((i)=>{
                return i.user;
            })
            
           const am_in=all_users.indexOf(email);
           if(am_in<0){
               not_in=false;
           }
            
        })
        console.log("the not in is",not_in);
        

        set_data(res6);
        dispatch(setLeaguePageResult(res6.length))
        set_create(false);
        set_creating(false);
        if(not_in==true){
            set_create(true);
        }


    },[options,t,game_date,picks])


    useEffect(()=>{
        console.log("create is ",create, "and creating is ",creating)
        if(create==false) return;
        if(creating==true) return;
        console.log("picks we have to create it",create,creating);
        
       if(game_date==undefined){
            return;
        }
        
        let new_date=game_date;
        if(game_date._d!=undefined){
            new_date=game_date._d;
        }
        const new_line={
            ...line,
            date:firebase.firestore.Timestamp.fromDate(new_date),
            parent:false,
        };
        console.log("the new line is ",new_line);
        delete new_line.key;
        delete new_line.wins;
        delete new_line.winners;
        delete new_line.fee;
        delete new_line.dates;
        delete new_line.invites;
        delete new_line.user;
        delete new_line.single;

        console.log("creating...");

        console.log("the new line");
        console.log(new_line);
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
    return(
        <div className="league_page_content">
            {
                data.map((item)=>{
                    console.log(item)
                    return(
                        <Line key={item.key} line={item} click={join} no_games={false} />
                    );
                })
            }

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
    )
}
export default LeaguePageContent;