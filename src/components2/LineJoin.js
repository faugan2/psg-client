import "../styles/line_join.scss";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import {selectJoin,selectLeagues,selectGames,selectDefaultValues,selectTimeZone, setSelectedPicks, setSendingPicks, selectGameDate} from "../features/counterSlice";
import Match from "./Match";
import {auth, db} from "../firebase_file";
import firebase from "firebase";
import ClearIcon from '@material-ui/icons/Clear';
import NearMeIcon from '@material-ui/icons/NearMe';

const moment=require("moment-timezone");
let id_inter=0;

const LineJoin=({click})=>{
    const join=useSelector(selectJoin);
    const leagues=useSelector(selectLeagues);
    const games=useSelector(selectGames);
    const default_values=useSelector(selectDefaultValues)
    const tz=useSelector(selectTimeZone);
    const game_date=useSelector(selectGameDate);
    console.log("the game date is ",game_date);

    const dispatch=useDispatch();

    const [league,set_league]=useState(null);
    const [data,set_data]=useState([]);
    const [show_ml_spread,set_ml_spread]=useState(null);
    const [loading,set_loading]=useState(false);
    const [picks,set_picks]=useState([]);


    useEffect(()=>{
        if(join==null) return;
        
        const res=leagues.filter((item)=>{
            return item.id==join.league;
        })
        if(res.length>0){
            set_league(res[0].name)
        }

        const res2=default_values.filter((item)=>{
            return item.key==join.league;
        })
        
        if(res2.length>0){
            set_ml_spread(res2[0]);
        }
    },[join])

    useEffect(()=>{
        if(league==null) return;
        if(games==null || games.length==0) return;

        set_loading(true)
        const res=games.filter((item)=>{
            return item.league==league;
        })

        const res2=res.filter((item)=>{
            const commence=item.commence
            const start=moment.tz(commence,tz);
            const today=moment.tz(game_date,tz);
            const end=moment().endOf("day");
            
            const diff=start.diff(today,"seconds");
            const diff_end=end.diff(today,"seconds");
            
            return diff>=0 && diff<=diff_end;
        })
        
        set_data(res2);
        set_loading(false);

    },[league,games]);

    const pick=(e)=>{
        const btn=e.target;
       

       
        const id_game=btn.dataset.key;
        const type_pick=btn.dataset.type;
        const team_picked=btn.dataset.team;
        const pickdata=btn.dataset.pickdata;
        const away=btn.dataset.away;
        const home=btn.dataset.home;
        const teams=[away,home];

        


        const a_pick={
            id_game,
            type_pick,
            team_picked,
            pickdata,
            teams,
            league:join?.league,
            sport:join?.sport,
            entry:join?.entry,
            user:auth?.currentUser?.email
        }

        //switch team if clic on the other team of the same type of odds

        const res1=picks.filter((item)=>{
            return item.id_game==id_game && item.type_pick==type_pick;
        })
        if(res1.length>0){
            const tp=res1[0].team_picked;
            if(tp!=team_picked){
                const res2=picks.map((item)=>{
                    if(item.id_game==id_game && item.type_pick==type_pick){
                        return {...item,team_picked}
                    }
                    return item;
                })

                set_picks(res2);
                dispatch(setSelectedPicks(res2));

               const new_btn=document.querySelector(`button[data-type='${type_pick}'][data-team='${team_picked}'][data-key='${id_game}']`);
               new_btn.classList.add("active");

               const old_btn=document.querySelector(`button[data-type='${type_pick}'][data-team='${tp}'][data-key='${id_game}']`);
               old_btn.classList.remove("active");
               
                return;
            }
        }



       const res=picks.filter((item,i)=>{
           return item.id_game==id_game && item.type_pick==type_pick && item.team_picked==team_picked
       })

       let new_picks=[];
       if(res.length>0){
           //already picked
            new_picks=picks.map((item,i)=>{
                if(item.id_game==id_game && item.type_pick==type_pick && item.team_picked==team_picked){
                    return null;
                }
                return item;
            })


            set_picks(new_picks.filter((item)=>{
                return item!=null;
            }));
       }else{
           //not picked yet
           if(join?.number_game==picks.length){
                console.log("enougth");
                clearInterval(id_inter);
                return;
            }
            new_picks=[...picks,a_pick];
            set_picks(new_picks);
       }

       btn.classList.toggle("active");

        
        
        dispatch(setSelectedPicks(new_picks));
        
    }


   const send_picks=(e)=>{

    if(picks.length!=parseInt(join.number_game)){
        alert("You must pick "+join.number_game+" games before submit");
        return;
    }
    const obj={
        user:auth?.currentUser?.email,
        picks,
        id_challenge:join?.key,
        type_challenge:join?.type,
        date:new firebase.firestore.FieldValue.serverTimestamp()
    };

    dispatch(setSendingPicks(true))

    db.collection("psg_picks").add(obj).then(async ()=>{
        console.log("picks are send well");
        const coins_info={
            user:auth?.currentUser?.email,
            id_challenge:join?.key,
            picks,
            entry:"-"+join?.entry,
            date:firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection("psg_users_coins").add(coins_info);
        dispatch(setSendingPicks(false))

        console.log("also coins removed from user account")
    }).catch((err)=>{
        console.log("something bad happened")
        dispatch(setSendingPicks(false))
    })

    
   }

   
   const quick_picks=(e)=>{
       const btns=document.querySelectorAll(".match  button");
       
       
      id_inter= setInterval(()=>{
        var index=Math.floor(Math.random()*btns.length);
        btns[index].click();
       },100)
   }
    return (
        <div className="line_join">

            {loading==true && <div className="info">
                <p>Please wait</p>
                <CircularProgress size={15} style={{color:"black"}} />
            </div>
            }

            {
                (loading==false && data.length==0) && 
                    <div className="info">
                        <p>No data found</p>
                    </div> 
            }

            {
                data.length>0 && 
                <div className="a_line">
                    <p>{
                        moment(game_date,tz).format("ll")
                        }</p>
                   {
                       data.map((item)=>{
                           return(
                               <Match 
                                    key={item.key} 
                                    match={item}  
                                    show_ml_spread={show_ml_spread}
                                    click={pick}
                                    />
                           )
                       })
                   }
                </div>
            }

            <div className="line_join_bottom">
                <button onClick={click}>
                    <ClearIcon />
                </button>
                {data.length>0 && <button>{picks.length}/{join?.number_game} picks</button>}
                {data.length>0 && <button onClick={quick_picks}>Quick picks</button>}
                {data.length>0 && <button onClick={send_picks}>
                    <NearMeIcon />
                </button>}
            </div>
           
            
        </div>
    )
}

export default LineJoin;