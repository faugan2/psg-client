import "../styles/main_footer.scss";
import TimelineIcon from '@material-ui/icons/Timeline';
import HomeIcon from '@material-ui/icons/Home';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import HistoryIcon from '@material-ui/icons/History';
import {useState,useEffect,useRef} from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu"
import { useSelector,useDispatch } from "react-redux";
import { selectGames } from "../features/counterSlice";
import GameSlide from "./GameSlide";
import {selectTimeZone,selectTournaments,selectUsers,selectPicks,setMyInvites} from "../features/counterSlice";
import {auth} from "../firebase_file";
import Badge from '@material-ui/core/Badge';
import {useTransition,animated} from "react-spring";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import bet365 from "./img/bet365.gif";

const moment=require("moment-timezone");
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const MainFooter=({click,click_profile,page,ads})=>{
    const ref=useRef(null);
    const games=useSelector(selectGames);
    const tz=useSelector(selectTimeZone);
    const t=useSelector(selectTournaments);
    const users=useSelector(selectUsers);
    const picks=useSelector(selectPicks);

    const dispatch=useDispatch();


    const [data,set_data]=useState([]);
    const [invite,set_invite]=useState([]);
    const [slide_id,set_slide_id]=useState(0);
    const [photo,set_photo]=useState(null)

    useEffect(()=>{
        if(auth.currentUser==null) return;
        if(users==null) return;
        const email=auth?.currentUser?.email;
        const me=users.filter((user)=>{
            return user.email==email;
        })

        if(me.length>0){
            const ph=me[0].photo;
            set_photo(ph);
        }
    },[auth,users])

    useEffect(()=>{
        const res=games.filter((item)=>{
            const start=moment.tz(item.commence,tz);
            const today=moment();
            const diff=today.diff(start,"seconds");
            return diff <=0
        })

       set_data(res);
    },[games])

    
   useEffect(()=>{
    if(t==null) return;
    const res=t.filter((item)=>{
        return item.parent==false;
    })

   const res2=res.filter((item)=>{
       return item.invites!=undefined;
   })

   const res3=res2.filter((item)=>{
       return item.user!=auth?.currentUser.email;
   })

   const res4=res3.filter((item)=>{
       const key=item.key;
       const res_picks=picks.filter((i)=>{
           return i.id_challenge==key;
       })
       console.log("for ",key)
       const all_players=res_picks.map((i)=>{
           const user=i.user;
           return user;
       })

       const type=item.type;
       let nb=0;
       if(type=="2"){
            nb=2;
       }else if(type=="3"){
           nb=10
       }else if(type=="4"){
           nb=999;
       }

       return all_players.indexOf(auth?.currentUser.email)<0 && all_players.length <nb;
   })

   const res5=res4.filter((item)=>{
       const invites=item.invites;
       const me=users.filter((i)=>{
           return i.email==auth.currentUser.email;
       })[0]?.key

       return invites.indexOf(me)>=0;
   }).filter((item)=>{
       const dt=moment(item.date?.seconds*1000).endOf("day");
       const diff=dt.diff(moment().endOf("day"),"seconds");   
       return diff>=0;
   })
   
   
   

  // console.log(res3)
    dispatch(setMyInvites(res5));
    set_invite(res5);
   },[t,picks]);
     

   let id_inter=0
   const slide=()=>{

    clearTimeout(id_inter);
    const btns=document.querySelectorAll(".game_slide");
    const total=btns.length;
    const index=Math.round(Math.random()*(total-1));
    for(var i=0; i<btns.length; i++){
        btns[i].classList.remove("active");
    }
    const btn=btns[index];
    if(btn!=undefined){
        btn.classList.add("active");
        set_slide_id(index);
    }

    id_inter=setTimeout(()=>{
        slide();
    },8000)

   }

   useEffect(()=>{
    /*slide();
    return()=>{
        console.log("clearing id_inter")
        clearTimeout(id_inter);
    }*/
   },[id_inter])


   const [show,set_show]=useState([1]);
   const transition=useTransition(show,{
       from:{
           x:0,
           y:200,
           opacity:0,
       },
       enter:{
           x:0,
           y:0,
           opacity:1,
       },
       leave:{
           x:0,
           y:200,
           opacity:0,
       }
   })

   useEffect(()=>{
    const btns=document.querySelectorAll(".menu>button");
    for(var i=0; i<btns.length; i++){
        btns[i].classList.remove("active");
    }
    btns[page].classList.add("active");
   },[page])

    return(

        transition((style,item)=>{
            if(item){
                return(
                    <animated.div className="main_footer" style={style}>

                        {(ads==undefined) &&<img src={bet365} />}
          
            {data.length>0 && <div className="main_footer_sliding_games">
                <AutoPlaySwipeableViews enableMouseEvents={true}>
                {
                    data.map((item,i)=>{
                        console.log("the game line ",i)
                        return(
                            <GameSlide key={i} id={i}  item={item} />
                        )
                    })
                }
                </AutoPlaySwipeableViews>
                
            </div>}
           <div className="menu">
            <button className={page==1?"active":""} onClick={click.bind(this,0)}>
                <HomeIcon style={{color:"gray",fontSize:"1.2rem"}} />
                Home
            </button>
            <button className={page==2?"active":""}onClick={click.bind(this,1)} style={{
                position:"relative",
            }}>
                <LiveTvIcon style={{color:"gray",fontSize:"1.2rem"}} />
                Live
                <Badge badgeContent={invite.length} color="secondary" style={{
                    position:"absolute",
                    top:"0.5rem",
                    marginLeft:"1.5rem"
                    
                }} />
            </button>
            <button  className={page==3?"active":""} onClick={click.bind(this,2)}>
                <HistoryIcon style={{color:"gray",fontSize:"1.2rem"}} />
                History
            </button>

            {/*<button  className={page==4?"active":""} onClick={e=>{
                const email=auth?.currentUser?.email;
                click_profile(email)
            }}>
                <img src={photo} 
                style={{width:"30px",height:"30px",borderRadius:"50%"}}
                 />
            </button>*/}

            
            
        </div>
        </animated.div>
                )
            }
        })
        
    );
}

export default MainFooter;