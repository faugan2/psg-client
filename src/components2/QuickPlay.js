import "../styles/quick_play.scss";
import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";
import {setJoin,selectTournaments,selectLeagues,selectSports,selectPicks,selectTimeZone, 
    selectSendingPicks,
    setSendingPicks,
    selectUsers,
    setSport, setGameDate, setLine} from "../features/counterSlice";
import Line from "./Line";
import {auth} from "../firebase_file"

import { BottomSheet } from 'react-spring-bottom-sheet'
import LineJoin from "./LineJoin";
import SendingPicks from "./SendingPicks";
import {useHistory} from "react-router-dom";


const moment=require("moment-timezone");

const QuickPlay=()=>{
    const t=useSelector(selectTournaments);
    const l=useSelector(selectLeagues);
    const s=useSelector(selectSports);
    const p=useSelector(selectPicks);
    const tz=useSelector(selectTimeZone);
    const sending=useSelector(selectSendingPicks);
    const u=useSelector(selectUsers);

    const dispatch=useDispatch();
    const history=useHistory();

    const [data,set_data]=useState([]);
    const [open,set_open]=useState(false);
    const [open_sending,set_open_sending]=useState(false);
    const [username,set_username]=useState("");

    useEffect(()=>{
        if(auth.currentUser==null || u==null){
            history.replace("/");
            return;
        }
        const res=u.filter((item)=>{
            return item.email==auth?.currentUser?.email;
        })
        if(res.length>0){
            set_username(res[0].username);
        }
        
    },[auth,u])

    useEffect(()=>{
        if(t==null || t.length==0) return ;
        
        
        const res=t.filter((item)=>{
            return item.parent==false;
        })

        const today=moment().endOf("day");
        
        const res2=res.filter((item)=>{
            const date=moment.tz(item.date?.seconds*1000,tz);
            const diff=date.diff(today);
            const type=item.type;
            let total_players=0;
            if(type==2){
                total_players=2;
            }else if(type==3){
                total_players=10
            }
            const key=item.key;
            const nb_picks=p.filter((i)=>{
               
                return i.id_challenge==key;
            })
            if(nb_picks.length==total_players){
                return false;
            }

            let part_of_it=false;
            for(var i=0; i<nb_picks.length; i++){
                const user=nb_picks[i].user;
                console.log(user)
                if(user==auth.currentUser.email){
                    part_of_it=true;
                }
            }
            if(part_of_it){
                return false;
            }
            
            return date.format("ll")==today.format("ll") || diff >0;
        })
        
        const dates=[];
        res2.map((item)=>{
            const date=moment.tz(item.date?.seconds*1000,tz).format("ll");
            if(dates.indexOf(date)<0){
                dates.push(date);
            }
        })
        
        const res3=dates.map((date)=>{
            const lines=[];
            res2.map((item)=>{
                const d=moment.tz(item.date?.seconds*1000,tz).format("ll");
                if(d==date){
                    lines.push(item);
                }

            })
            return {date,lines}
        })
        console.log(res3)
        set_data(res3);
        
        
    },[t,p])

    const line_clicked=(line)=>{
        const line_sport=line.sport;
        const sport=s.filter((item)=>{
            return item.id==line_sport;
        })[0];
       
        dispatch(setSport(sport));
        const date=moment.tz(line.date?.seconds*1000,tz);
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
    return(
        <div className="quick_play">
            <div className="info">
                <h1>Hello, {username}</h1>
                {data.length>0 &&  <p>We have quick play for you.</p>}
                {data.length==0 && 
                <div>
                    There is no Quick Play available.
                    <br />Select a Sport above or 
                    <br />Start a challenge now by clicking the button bellow.
                    <button>
                        Start Now
                    </button>
                </div>
                }
               
            </div>
            
           {
               data.map(({date,lines},i)=>{
                    return(
                        <div key={i} className="lines">
                                <p>{date}</p>
                                {
                                    lines.map((line)=>{
                                        return (
                                            <Line key={line.key} line={line} click={line_clicked.bind(this,line)}
                                            show_details={true}
                                            />
                                        )
                                    })
                                }
                        </div>
                    )
               })
           }

                <BottomSheet  open={open}>
                    <LineJoin click={close_modal} from_main={true} />
                </BottomSheet>

                <BottomSheet  open={open_sending}>
                    <SendingPicks click={close_sending_picks} />
                </BottomSheet>
        </div>
    );
}

export default QuickPlay;