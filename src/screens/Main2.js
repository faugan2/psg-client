import { useDispatch, useSelector } from "react-redux";
import { selectActiveTab, selectTournaments, setSport, 
    selectTab,setTab, setActiveTab, setPage,setHeaderTab,selectHeaderTab, selectUsers, 
    setSelectedPlayer, setScreenHeight, setHeaderHeight,setInvitedFriends,setFriendChallenged, selectSports,
    setGameDate,
    setUserProfile,
    selectNotEnoughCoins,
    setNotEnoughCoins,
    selectChatUnread,
    selectChatTotal,
    selectChatRead,
    selectLeagues,
    selectPicks,
    selectSendingPicks,
    selectTimeZone,
    setSelectedPicks,
    selectJoin,
    setLine,
    setJoin,
    setJoinSuccess,
    selectGameDate,
    selectTransactions,
    setSendingPicks
    
 } 
from "../features/counterSlice";
import { auth,db } from "../firebase_file";
import { useEffect, useState } from "react";
/*import Lobby from "../components/Lobby";
import Games from "../components/Games";
import Live from "../components/Live";
import Friends from "../components/Friends";*/
import { useHistory } from "react-router-dom";
/*
import Nav from "../components/Nav";
import Top from "../components/Top";*/
import '@fontsource/roboto';

import Header from "../components2/Header2";
import SwipeableViews from 'react-swipeable-views';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { Avatar } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import Leagues from "../components2/Leagues";
import MainFooter from "../components2/MainFooter";
import Live2 from "../components2/Live";
import History2 from "../components2/History";
import LockerRoom2 from "../components2/LockerRoom";
import ForumIcon from '@material-ui/icons/Forum';
import Chat from "../components2/Chat"
import { BottomSheet } from 'react-spring-bottom-sheet'
import Profile from "../components2/UserProfile";
import NotEnoughCoins from "../components2/NotEnoughCoins";
import DailyBonusCoins from "../components2/DailyBonusCoins";

import Badge from '@material-ui/core/Badge';
import "../styles/main.scss";
import 'prevent-pull-refresh';

import {useTransition,animated} from "react-spring";
import Pager from 'react-js-pager';
import PagerItem from "../components2/PagerItem";
import firebase from "firebase";
import {user_coins} from "../components2/data";

const moment=require("moment-timezone");
let id_inter=0;

const Main=()=>{
    
    const history=useHistory();
    const dispatch=useDispatch();


    const t=useSelector(selectTournaments);
    const l=useSelector(selectLeagues);
    const p=useSelector(selectPicks);
    const tz=useSelector(selectTimeZone);
    const sending=useSelector(selectSendingPicks);
    const game_date=useSelector(selectGameDate);
    const all_transactions=useSelector(selectTransactions);

    const [h,setH]=useState(0);
    const [data,set_data]=useState([]);
    const [user,set_user]=useState(null);
    const [photo,setPhoto]=useState("foo.jpg");
    const u=useSelector(selectUsers);
    const s=useSelector(selectSports);
    const ne=useSelector(selectNotEnoughCoins);
    const [chat_unread,set_chat_unread]=useState(0);
    const chat_total=useSelector(selectChatTotal);
    const chat_read=useSelector(selectChatRead);
    const join=useSelector(selectJoin);

    console.log("thechat unrea d is ",chat_unread);

    const [page,set_page]=useState(0);
    const [open,set_open]=useState(false);
    const [open_profile,set_open_profile]=useState(false);
    const [open_not_enough,set_open_not_enough]=useState(false);
    const [open_daily_bonus,set_open_daily_bonus]=useState(false);
    const [loading,set_loading]=useState(true);
    const [can_create,set_can_create]=useState(false);
    const [picks,set_picks]=useState([]);


    const close_not_enough=()=>{
        //set_open_not_enough(false);
        dispatch(setNotEnoughCoins(false))
    }

    const close_daily_bonus=()=>{
        set_open_daily_bonus(false);
    }
    const close_modal=()=>{
        set_open(false);
    }
    const close_open_profile=()=>{
        
        set_open_profile(false);

    }

    const open_modal_profile=(email)=>{
        dispatch(setUserProfile(email))
        history.push("/profile")
        //set_open_profile(true);
        
    }

    useEffect(()=>{
        if(chat_total==null || chat_read==null) return;
        set_chat_unread(chat_total-chat_read);
    },[chat_total,chat_read])

    useEffect(()=>{
        set_open_not_enough(ne);
    },[ne])

    useEffect(()=>{
        dispatch(setGameDate(new Date()));
    },[])

    useEffect(()=>{
        if(s==null || s.length==0) {
            history.replace("/");
        }
    },[s])
   

    useEffect(()=>{
        //console.log("ok for this")
        const height=window.screen.height
        const header=document.querySelector("#header")?.clientHeight;
        const dif=height-header;
        setH(dif);

        const sc=document.querySelectorAll(".slide_content");
        sc.forEach((s)=>{
            s.style.height=dif+"px";
        })
    },[])

    useEffect(()=>{
        window.addEventListener('resize', handle_resize_window, true);
        return ()=>{
            //console.log("ok")
            window.removeEventListener("resize",handle_resize_window);
        }
    },[])

    const handle_resize_window=(event)=>{
        const height=window.screen.height
        dispatch(setScreenHeight(height));
        const header=document.querySelector("#header")?.clientHeight;
        const dif=height-header;
        dispatch(setHeaderHeight(header))
        setH(dif);
        //console.log("resize is now ",dif);
    }
    
    const tab_index=useSelector(selectTab);
    const [index,setIndex]=useState(0);
    const [game_index,set_game_index]=useState(0);

    useEffect(()=>{
        setIndex(tab_index);
    },[tab_index]);

    const handleChangeIndex=(index)=>{
        dispatch(setTab(index))
        setIndex(index);
    }

    const [games_drawer,set_games_Drawer]=useState(false);
    const onGames_drawer_closed=()=>{
        set_games_Drawer(!games_drawer);
    }

   /* useEffect(()=>{
        if(auth.currentUser==null){
            history.replace("/");
            return;
        }

        const email=auth?.currentUser?.email;
    },[auth]);*/


    useEffect(()=>{
       
        if(auth?.currentUser==null){
            //history.push("/");
            return;
        }
        const res=u.filter((user)=>{
            return user.email==auth?.currentUser.email;
        });
        if(res.length>0){
            set_user(res[0]);
            setPhoto(res[0].photo);
        }
    },[u]);

    const go_to_profile=()=>{
        if(auth?.currentUser==null){
            history.push("/");
            return;
        }
        const email=auth?.currentUser.email;
        const res=u.filter((user)=>{
           return user.email==email;
        })
    
        const user=res[0];
        dispatch(setSelectedPlayer(user));
        history.push("/profile");
    
    }


    const go_to_friends=()=>{
        history.push("start-game");
    }
	
	const create_new_challenge=()=>{
		dispatch(setInvitedFriends([]));
		dispatch(setFriendChallenged({}))
		history.push("/challenge-friend");
	}

  
    const change_page=(index)=>{
        set_page(index);
    }

    //console.log("here we go then h");

    useEffect(()=>{
        dispatch(setSport(null))
    },[])

    const [show_chat_btn,set_show_chat_btn]=useState([1]);
    const transition=useTransition(show_chat_btn,{
        from:{x:0,y:-500,opacity:0},
        enter:item=>async (next)=>{
            await next({x:0,y:0,opacity:0.5,delay:1000});
            await next({opacity:1})
        },
        leave:{x:0,y:-800,opacity:0}
    })

    const tab_changed=(index)=>{
        console.log(index);
        set_page(index);
    }

    useEffect(()=>{
        const today=moment().format("ll");
        const email=auth?.currentUser?.email;
        if(email==undefined) return;
        
        console.log("today is ",today,"and email is ",email);
        db.collection("psg_bonus")
        .where("email","==",email)
        .where("date","==",today)
        .get().then((res)=>{
            if(res.docs.length==0){
                set_open_daily_bonus(true);
                db.collection("psg_bonus").add({email,date:today});
            }else{
                console.log("alerady bonus received");
                set_open_daily_bonus(false);
            }
        });

        

    },[auth])

    useEffect(()=>{
        if(t==null || t.length==0) return ;
        
        
        set_loading(true);
        //set_can_create(false);
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
                if(user==auth.currentUser?.email){
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
        console.log("the final data is ",res3)
        set_data(res3);

        set_loading(false);
        if(res3.length==0){
           // set_can_create(true);
        }
        
        
        
    },[t,p])


    const quick_picks=(i,item)=>{
        
        set_game_index(i);
        
       const sport=item.sport;
       const date=moment.tz(item.date?.seconds*1000,tz);
       dispatch(setGameDate(date));
       
      const res=s.filter((sp)=>{
          return sp.id==sport;
      })
      if(res.length>0){
          dispatch(setSport(res[0]));
      }
      dispatch(setLine(item));
      dispatch(setJoin(item))
    
    dispatch(setSelectedPicks([]));
    set_picks([]);
       const btns=document.querySelectorAll(`#all_games${i}>div>.match  button`);
       for(var i=0; i<btns.length; i++){
           btns[i].classList.remove("active");
       }
       
      id_inter= setInterval(()=>{
        var index=Math.floor(Math.random()*btns.length);
        btns[index].click();
       },100)
   }


   //######################################

   const pick=(e,line,index)=>{
       set_game_index(index);
    const sport=line.sport;
       const date=moment.tz(line.date?.seconds*1000,tz);
       dispatch(setGameDate(date));
       
      const res0=s.filter((sp)=>{
          return sp.id==sport;
      })
      if(res0.length>0){
          dispatch(setSport(res0[0]));
      }
      dispatch(setLine(line));
      dispatch(setJoin(line))

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
        }else{
            console.log("not enougth",join?.number_game,picks.length);
        }
        new_picks=[...picks,a_pick];
        set_picks(new_picks);
   }

   btn.classList.toggle("active");

    
    
    dispatch(setSelectedPicks(new_picks));
    
}
   //#####################################""


   useEffect(()=>{
        
       

        if(picks.length==join?.number_game){
            console.log("ok we are good",`#btn_join${game_index}`)
            const btn=document.querySelector(`#btn_join${game_index}`);
            console.log("the btn is ",btn);
            btn?.classList.add("active");
        }else{
            const btn=document.querySelector(`#btn_join${game_index}`);
            btn?.classList.remove("active");
        }

        console.log("the btn picks is ",picks);
   },[picks])


   //####################################

   const send_picks=(e)=>{

    if(join==null){
        alert("You must pick  games before submit");
        return;
    }
    
    dispatch(setJoinSuccess(false));
    if(picks.length!=parseInt(join?.number_game)){
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
        //click();
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

        /*if(from_main==true){
            create_new_challenge(join?.key);
        }*/


        console.log("also coins removed from user account")
    }).catch((err)=>{
        console.log("something bad happened")
        dispatch(setSendingPicks(false))
    })

    
   }

   //###################################

    let pagerMethods = null;
    return(
<div  className="main2">
    
    <Header 
        onGames_drawer_closed={onGames_drawer_closed} 
        index={index}
        click_profile={open_modal_profile}
        show_leagues={false}
    />
    <div className="content">
        <Pager
          ref={node => (pagerMethods = node)}
          orientation='vertical'
          animationStyle='scroll'
          
          wrapperStyle={{ 
              width: '100%',
              backgroundColor:"black",
              height:"calc(100%)" 
            }}
        >
          {
              data.map((item,i)=>{
                  const date=item.date;
                  const lines=item.lines;
                  return <>
                      {
                        lines.map((line,i2)=>{
                          return(
                              <PagerItem 
                              key={`${i2}${i}`} 
                              index={`${i2}${i}`} 
                              item={line} 
                              date={date} 
                              quick_picks={quick_picks}
                              pick={pick}
                              send_picks={send_picks}
                              />
                            )
                        })
                      }
                  </>
                 
                  
              })
          }
          
        </Pager>
    </div>


    {/*<MainFooter 
    click={change_page} 
    ads={false}
    page={page} 
    click_profile={open_modal_profile} 
    />*/}

    
    

    <BottomSheet open={open}>
        <Chat click={close_modal}/>
    </BottomSheet>
    <BottomSheet open={open_profile}>
        <Profile click={close_open_profile}/>
    </BottomSheet>

    <BottomSheet open={open_daily_bonus}>
        <DailyBonusCoins click={close_daily_bonus}/>
    </BottomSheet>

    </div>
    );
}

export default Main;