import "../styles/line_join.scss";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useEffect, useState,useRef} from "react";
import { useDispatch, useSelector} from "react-redux";
import {selectJoin,selectLeagues,selectGames,selectDefaultValues,selectTimeZone, setSelectedPicks, 
    setSendingPicks, selectGameDate,setGames, setJoinSuccess,selectTournaments,
    selectTransactions,
    setNotEnoughCoins,
    selectNotEnoughCoins
} from "../features/counterSlice";
import Match from "./Match";
import {auth, db} from "../firebase_file";
import firebase from "firebase";
import ClearIcon from '@material-ui/icons/Clear';
import NearMeIcon from '@material-ui/icons/NearMe';
import RefreshIcon from '@material-ui/icons/Refresh';
import HeaderBottomSheet from "./HeaderBottomSheet";
import {user_coins} from "./data";

const moment=require("moment-timezone");
let id_inter=0;

const LineJoin=({click,from_main})=>{
    const join=useSelector(selectJoin);
    const leagues=useSelector(selectLeagues);
    const games=useSelector(selectGames);
    const default_values=useSelector(selectDefaultValues)
    const tz=useSelector(selectTimeZone);
    const game_date=useSelector(selectGameDate);
    const t=useSelector(selectTournaments);
    const all_transactions=useSelector(selectTransactions);
    

    const dispatch=useDispatch();

    const [league,set_league]=useState(null);
    const [data,set_data]=useState([]);
    const [show_ml_spread,set_ml_spread]=useState(null);
    const [loading,set_loading]=useState(false);
    const [picks,set_picks]=useState([]);
    const [game_loading,set_game_loading]=useState("");
    const [dates,set_dates]=useState([]);

    const btn_loading_games=useRef(null);



   


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

        let d=game_date._d;
        if(d==undefined){
            d=game_date;
        }
        d=moment(d,tz).format("ll");
        console.log("the new date is ",d);
        if(join.dates!=undefined){
            set_dates(join.dates);
        }else{
            set_dates([d]);
        }
    },[join])

    useEffect(()=>{
        console.log("the dates are ",dates);
    },[dates])
    

    useEffect(()=>{
        if(league==null) return;
        if(games==null || games.length==0) return;

        set_loading(true)
        const res=games.filter((item)=>{
            return item.league==league;
        })

        const res2=res.filter((item)=>{
            const commence=item.commence
            let d=game_date._d;
            if(d==undefined){
                d=game_date;
            }
            const start=moment.tz(commence,tz);
            const today=moment.tz(d,tz);
            const end=moment().endOf("day");
            
            const diff=start.diff(today,"seconds");
           
            const str_start=start.format("ll");
            const str_today=today.format("ll");
           
            if(dates.indexOf(str_start)<0){
                return false;
            }

            return true;
          
        })
        
        const res_final=[];
        for(var i=0; i<dates.length; i++){
            const dt=dates[i];
            const res3=res2.filter((item)=>{
                const a_start=moment.tz(item.commence,tz);
                return a_start.format("ll")==dt;

            })
            if(res3.length>0){
                res_final.push({date:dt,data:res3})
            }
           
        }
        console.log(res_final)
       
        
        //set_data(res2);
        set_data(res_final);
        set_loading(false);

        console.log("the results are ",res_final)

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

    
    dispatch(setJoinSuccess(false));
    if(picks.length!=parseInt(join.number_game)){
        alert("You must pick "+join.number_game+" games before submit");
        return;
    }
    
    let d=game_date._d;
    if(d==undefined){
        d=game_date;
    }
    const obj={
        user:auth?.currentUser?.email,
        picks,
        id_challenge:join?.key,
        type_challenge:join?.type,
        date:new firebase.firestore.Timestamp.fromDate(d)
    };
   
   

    const entry=parseFloat(join?.entry);
    const my_coins=user_coins(auth?.currentUser?.email,all_transactions);
   
    
    if((entry+0.100)>my_coins && entry>0){
        click();
        dispatch(setNotEnoughCoins(true))
        return;
    }
    
    dispatch(setSendingPicks(true))

    db.collection("psg_picks").add(obj).then(async ()=>{

      
        let new_entry=0;
        if(join?.entry!="0"){
            new_entry=parseInt(join?.entry)+0.1;
        }
        const coins_info={
            user:auth?.currentUser?.email,
            id_challenge:join?.key,
            picks,
            entry:"-"+new_entry,
            date:firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection("psg_users_coins").add(coins_info);
        dispatch(setJoinSuccess(true))
        setTimeout(()=>{
            dispatch(setSendingPicks(false))
        },200)

        if(from_main==true){
            create_new_challenge(join?.key);
        }


        console.log("also coins removed from user account")
    }).catch((err)=>{
        console.log("something bad happened")
        dispatch(setSendingPicks(false))
    })

    
   }


   const create_new_challenge=(id_challenge)=>{
       const res=t.filter((item)=>{
           return item.key==id_challenge;
       })

       if(res.length>0){
           const challenge={...res[0]};
           delete challenge.key;
           delete challenge.challenge_results;

          db.collection("psg_challenges").add(challenge).then(()=>{
              console.log("the new challenge created")
          }).catch((err)=>{
              console.log("the new erreur",err.message);
          });
           
       }
   }
   
   const quick_picks=(e)=>{
        dispatch(setSelectedPicks([]));
        set_picks([]);
       const btns=document.querySelectorAll(".match  button");
       for(var i=0; i<btns.length; i++){
           btns[i].classList.remove("active");
       }
       
      id_inter= setInterval(()=>{
        var index=Math.floor(Math.random()*btns.length);
        btns[index].click();
       },100)
   }

   const load_games=()=>{
       set_game_loading("Loading...");
       btn_loading_games.current.disabled=true;
       db.collection("psg_games").get().then((snap)=>{
           const g=[];
           snap.docs.map((doc)=>{
               const key=doc.id;
               const data=doc.data();
               data.key=key;
               g.push(data);
           })

           dispatch(setGames(g));
           //console.log("all games are now ",g.length);
           btn_loading_games.current.disabled=false;
           set_game_loading("");
       })


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
                        <p>It seems that there is no game playing on this date.
                            Please click on the button below to refresh.
                        </p>

                        <button onClick={load_games} ref={btn_loading_games}>
                            <RefreshIcon style={{fontSize:"1.2rem"}} />
                            Refresh
                        </button>

                        <label>{game_loading}</label>
                    </div> 
            }

            {
                data.length>0 && 
                <div className="a_line">
                    
                   {
                       data.map((item,i)=>{

                        const dt=item.date;
                        const matches=item.data;
                        return(
                            <div key={i}>
                                <p>{dt}</p>
                                {
                                    matches.map((match)=>{
                                        return(
                                            <Match 
                                                key={match.key} 
                                                match={match}  
                                                show_ml_spread={show_ml_spread}
                                                click={pick}
                                                />
                                        )
                                    })
                                }
                            </div>
                        )
                           
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

            {data.length>0 && <div className="line_join_bottom">
               
                {data.length>0 && <button>{picks.length}/{join?.number_game} picks</button>}
                {data.length>0 && <button onClick={quick_picks}>Quick picks</button>}
                {data.length>0 && <button onClick={send_picks} 
                className={picks.length==join?.number_game ? "active":""}>
                    <NearMeIcon />
                </button>}
            </div>
            }

            <HeaderBottomSheet title="Make Your Picks">
                <button onClick={click} className="line_join_close_btn">
                    <ClearIcon />
                </button>
            </HeaderBottomSheet>

            
           
            
        </div>
    )
}

export default LineJoin;