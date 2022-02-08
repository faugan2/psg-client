import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLeagues, selectSelectedGames, 
    selectTodayTime,
    selectDefaultValues,
    selectNextGamesDates,
    selectTimeZone,
    selectSelectedPicks, selectSelectedTournament, 
    selectUsers, setSelectedGames, setSelectedPicks, selectGames, selectChallengeDate, setNextGamesDates } from "../features/counterSlice";
import HeaderBack from "./HeaderBack"
import JoinSkeleton from "./skeleton/JoinSkeleton";
import {auth, db} from "../firebase_file";
import Game from "./Game";
import DeleteIcon from '@material-ui/icons/Delete';

import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Pick from "./Pick";

import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import  firebase from "firebase";
import { useHistory } from "react-router-dom";
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import BottomSheet from "./BottomSheet";
import { useRef } from "react";
const moment=require("moment-timezone");

const Join=()=>{

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor:"black",
          backgroundColor:"rgba(0,0,0,0.7)",
          width:"80%",
          minHeight:"65vh",
          position:"relative",
        },
      };

    const dispatch=useDispatch();
    const history=useHistory();
    const l=useSelector(selectLeagues);
    const t=useSelector(selectSelectedTournament);
    const p=useSelector(selectSelectedPicks);
    const u=useSelector(selectUsers);
    const today_time=useSelector(selectTodayTime);
    const all_games=useSelector(selectSelectedGames)
    const games_redux=useSelector(selectGames);
    const selected_date=useSelector(selectChallengeDate);
    //alert(selected_date);
    const time_zone=useSelector(selectTimeZone);


    const [games,set_games]=useState([]);
    const [total_pick,setTotal_pick]=useState(0);
    const [picks,setPicks]=useState([]);
    const [alerte,setAlerte]=useState("");
    const [loading,setLoading]=useState(true);
    const [me,set_me]=useState({});
    const [ch_date,set_ch_date]=useState(selected_date);
    const [ch_date_text,set_ch_date_text]=useState(new Date().getTime());
    const [tz,set_tz]=useState(time_zone);

    useEffect(()=>{
        let sd=new Date();
        if(selected_date!=""){
            sd=selected_date;
        }
       sd=sd.getTime();
      set_ch_date(sd);

      let ch_date_str=new Date(sd).toUTCString();
      ch_date_str=ch_date_str.split(" ");
      ch_date_str=ch_date_str[1]+" "+ch_date_str[2]+" "+ch_date_str[3];
      set_ch_date_text(ch_date_str);

    },[selected_date]);

    useEffect(()=>{
        if(u.length==0){
            history.push("/");
            return;
        }
    },[u]);




    let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal=()=> {
    setIsOpen(true);
    setAlerte("");
  }

  
  const  afterOpenModal=()=> {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  const closeModal=()=> {
    setIsOpen(false);
  }

    
    useEffect(()=>{
       
        setPicks(p);
        setTotal_pick(p.length);
       
        
    },[p]);

    useEffect(()=>{
        const res=u.filter((user)=>{
            return user.email==auth?.currentUser?.email;
        })
       
        if(res.length>0){
            set_me(res[0]);
        }
    },[u]);

    
    
    const [ch_dates,set_ch_dates]=useState([]);
    useEffect(()=>{
        //console.log("the selected challenge is ",t);
        let dates=[];
        if(t.multiple==true){
            dates=t.dates;
            set_ch_dates(dates);
        }else{
            let new_ch_date=moment.tz(ch_date,tz).format("ll");
            set_ch_dates([new_ch_date]);
        }

        


       const id_league=t.league;
       let league_name="";
       const res=l.filter((el)=>{
           return el.id==id_league;
       });
       if(res.length>0){
           league_name=res[0].name;
       }
       if(league_name!=""){
        dispatch(setNextGamesDates([]));
           const nexts=[];
          

          const res2= games_redux.filter((item,index)=>{
           
            //console.log("new date are",ch_date);
            let time=item.commence;
           // console.log("the game time is ",time);
            let new_time=moment.tz(time,tz).format("ll");
           

            
            const a=moment.tz(time,tz); // the moment the game starts
            const b=moment.tz(moment(),tz); // current date


            const new_diff=moment.duration(a.diff(b)).asHours(); //remaining hours
           
            let new_ch_date_str=moment.tz(ch_date,tz).format("ll");
            console.log("b is ",ch_dates.indexOf(new_time),ch_dates);
            //ch_dates.indexOf(new_time)>=0 &&
           
            return item.league==league_name &&
            new_diff>=0 && 
            ch_dates.indexOf(new_time)>=0; 
            ;
            
          
           })
		
           console.log("the results are ",res2);
           set_games(res2);
           dispatch(setSelectedGames(res2));
           setLoading(false);
       }
    },[l,t,games_redux,ch_date]);

   

    const handle_join=(e)=>{
        setAlerte("");
        const btn=e.target;
        const has_active=btn.classList.contains("active");

        if(total_pick==t.number_game && !has_active){
          //  //console.log("done");
            clearTimeout(id_function);
            console.log("going to return now");
           
            setIsOpen(true);
           // document.querySelector("#btn_open_bottom_sheet").click();
            
            return;
        }
        console.log("going to do something");

        btn.classList.toggle("active");
        const id_game=btn.dataset.key;
        const type_pick=btn.dataset.type;
        const team_picked=btn.dataset.team;
        const pickdata=btn.dataset.pickdata;

        let teams=[];
        const res_current_game=all_games.filter((g)=>{
            return g.key==id_game;
        });

        if(res_current_game.length>0){
            teams=[res_current_game[0].away,res_current_game[0].home];
        }
        ////console.log(pickdata);
        
        const pick={id_game,type_pick,team_picked,pickdata,teams,league:t.league,sport:t.sport,entry:t.entry,user:auth?.currentUser?.email}
        const old_picks=[...picks];
        if(has_active){
            const res=old_picks.filter((el)=>{
                return  !(el.id_game==id_game && 
                        el.type_pick==type_pick && 
                        el.team_picked==team_picked)
            });
            setTotal_pick(total_pick-1);
            setPicks(res);
            dispatch(setSelectedPicks(res));
            if(res.length==t.number_game){
                setIsOpen(true);
                
                
            }
        }else{
            old_picks.push(pick);
            setTotal_pick(total_pick+1);
            setPicks(old_picks);
            dispatch(setSelectedPicks(old_picks));
            if(old_picks.length==t.number_game){
                setIsOpen(true);
                
                
            }
        }

        
          
       
    }
    const clear_picks=()=>{
        //alert("clearing picks");
        const btns=document.querySelectorAll(".game > div > p > button.active");
        btns.forEach((btn)=>{
            btn.classList.toggle("active");
        })
        setTotal_pick(0);
        setPicks([]);
        dispatch(setSelectedPicks([]));
        setAlerte("");
        setIsOpen(false)
    }

    const quick_picks=()=>{
        clear_picks();
        
      //  //console.log(picks);
        make_quick_picks();
    }
    let id_function=0;
    const make_quick_picks=()=>{
        ////console.log("picks are",picks);
        ////console.log(total_pick, " and ",t.number_game);
        if(total_pick==t.number_game){
            clearTimeout(id_function);
            
        }
        const btns=document.querySelectorAll(".game > div > p > button");
        const index=Math.round(Math.random()*btns.length);
        ////console.log(index);
        const btn=btns[index];
        if(btn!=undefined){
            btn.click();
        }

        id_function=setTimeout(()=>{
            make_quick_picks();
        },3000)
        
    }

    const sendPicks=async (e)=>{
        setAlerte("Please wait...");
        const id_challenge=t.key;
        console.table([t]);
        const ch_type=t.type;
       

        const obj={
            user:auth?.currentUser?.email,
            picks,
            id_challenge,
            type_challenge:t.type,
            date:new firebase.firestore.FieldValue.serverTimestamp()
        };
      
        const btn=e.target;
        btn.disabled=true;
        btn.style.opacity="0.3";
       
        
         db.collection("psg_picks").add(obj).then(async ()=>{
            const coins_info={user:auth?.currentUser?.email,id_challenge,picks,entry:"-"+entry,date:firebase.firestore.FieldValue.serverTimestamp()};
            await db.collection("psg_users_coins").add(coins_info);
            
            const res=await 
            db.collection("psg_picks")
            .where("id_challenge","==",id_challenge)
            .get();

            const ch_nb_picks=res.docs.length;
            let can_create=false;
            if(t.parent!=undefined){
                if(ch_type==2){
                    if(ch_nb_picks==2){
                        can_create=true;
                    }
                }else if(ch_type==3){
                    if(ch_nb_picks==10){    
                        can_create=true;
                    }
                }
            }
            if(can_create==true){
                let clone_challenge={...t};
                delete clone_challenge.key;
                delete clone_challenge.fee;
                delete clone_challenge.nb_game;
                clone_challenge.parent=false;
                clone_challenge.date=new Date(ch_date)

               // await  db.collection("psg_challenges").add(clone_challenge);
            }
           
            
            setAlerte("");
            dispatch(setSelectedPicks([]));
            history.replace("/main");
            
         }).catch((err)=>{
             setAlerte("Error, please try again");
             btn.disabled=false;
            btn.style.opacity="1";
         })

    }

    const [my_coins,set_my_coins]=useState(0);
    const [entry,setEntry]=useState(0);

    useEffect(()=>{
       setEntry(t.entry);
    },[t]);

    useEffect(()=>{
        const email=auth?.currentUser?.email;
        if(email==undefined){
            return;
        }
       
        const unsub=db.collection("psg_users_coins").where("user","==",email).onSnapshot((snap)=>{
            let total_coins=5000;
            snap.docs.map((doc)=>{
                const coins=parseInt(doc.data().entry);
                total_coins+=coins;
                
            })
            //console.log("ok for ",total_coins);
            set_my_coins(total_coins);
        });

        return unsub;
    },[auth,modalIsOpen]);

    const go_to_wallet=()=>{
        history.push("/wallet");
    }

    const go_to_home=()=>{
        history.push("/main");
    }


    const dv=useSelector(selectDefaultValues);
    const [sdv,set_sdv]=useState(null);
    useEffect(()=>{
        const id_l=t.league;
        const res=dv.filter((item)=>{
            return item.key==id_l;
        })
        if(res.length>0){
            set_sdv(res[0]);
        }
       // //console.log("ther resule is ",res);
    },[dv,t]);

    const [can_delete,set_can_delete]=useState(false);
    useEffect(()=>{
        if(p.length==0){
            set_can_delete(false);
        }else{
            set_can_delete(true);
        }
    },[p]);

    const nexts=useSelector(selectNextGamesDates);
    const [next,set_next]=useState("");
    useEffect(()=>{
        if(nexts.length>0){
            set_next(nexts[nexts.length-1]);
        }
    },[nexts]);


    const ref=useRef(null);
    useEffect(()=>{
        console.log("modal is changed",ref.current);
        if(modalIsOpen==true){
            document.querySelector("#btn_open_bottom_sheet").click();
            console.log("going to open modal")
        }else{
            console.log("going to close modal");
        }
      },[modalIsOpen]);
    
      const [today,set_today]=useState("today");
      useEffect(()=>{
        let date=moment.tz(new Date().getTime(),tz).format("ll");
        
        set_today(date);
      },[]);
   
    return(
        <div className="join" style={{backgroundColor:"whitesmoke",minHeight:"100vh"}}>
            <HeaderBack title_redux={false} title="Make your picks"
			show_menu={false}
			show_empty_div={true}
			/>
                

            <div className="join_body single_page_body" style={{backgroundColor:"whitesmoke",overflowY:"auto"}} >
                {
                    loading==true && 
                    [1,2,3,4,5].map((el)=>{
                        return (<JoinSkeleton key={el} />);

                    })
                }

				{
					games.length >0 && 
					<div 
					className="join_options"
					style={{
						
						
					}}>
						<div>
							<button onClick={e=>{
                                
                                setIsOpen(true);
                            }}>
								<p>{total_pick}/{t.number_game || 0}</p>
								<p style={{fontWeight:"bold",fontSize:"0.6rem"}}>Total Picks</p>
							</button>
						</div>
						<div>
							<button className="btn_quick" onClick={quick_picks} >
								<FlipCameraAndroidIcon  style={{fontSize:"1rem"}}/>
								 <p style={{fontWeight:"bold",fontSize:"0.6rem"}}>Quick Pick</p>
							</button>
						</div>
						 <div>
							
							{ <button onClick={clear_picks} >
								<DeleteIcon style={{fontSize:"1rem"}} /> 
								<p style={{fontWeight:"bold",fontSize:"0.6rem"}}>Delete</p>
							</button>}
						</div>
                        
						
					</div>
				}
               

                {
                    ch_dates.map((date)=>{
                        const res=games.filter((g)=>{
                            const g_date=moment.tz(g.time,tz).format("ll");
                            return date==g_date;
                        })
                        return(
                            <div>
                                <div style={{
                                    display:"flex",
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}>
                                <p style={{
                                     fontSize:"0.7rem",
                                     fontWeight:"bold",
                                     backgroundColor:"black",
                                     textAlign:"center",
                                     color:"white",
                                     width:"80px",
                                     padding:"0.4rem",
                                     marginTop:"0.5rem",
                                     opacity:0.3, 
                                }}>{date}</p>
                                </div>

                                {
                                    res.length==0 && 
                                    <div className="alerte" style={{
                                        display:"flex",alignItems:"center",
                                        justifyContent:"center",
                                        marginBottom:"1rem",
                                    }}>
                                        <p style={{fontSize:"0.7rem",marginTop:"0.3rem"}}>No game found</p>
                                    </div>
                                }
                                {
                                    res.map((g)=>{
                                        
                                        
                                        return(
                                            <Game  
                                        key={g.key} 
                                        game={g} 
                                        btnClick={handle_join} 
                                        dv={sdv} 
                                        time={g.time} 
                                        ch_date={ch_date}
                                        />
                                        )

                                    })
                                }
                            </div>
                        );
                    })
                }

               
                

                {
                    loading==false && games.length==0 && 
                    <div style={
                        {
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center",
                            gap:"0.5rem",
							marginTop:"2rem",
                            
                        }}>
                        
                       
                        <button className="btn_stats_follow"
                        onClick={go_to_home}
                        style={{padding:"0.6rem",width:"40%"}}>Go Back</button>
                    </div>
                }
                
            </div>

            


            
                        <BottomSheet
                        ref={ref}
				content={<div onClick={e=>e.stopPropagation()}
                style={{padding:"1rem",position:"relative", minHeight:"60vh"}}
                id="my_bottom_sheet"
                >
                     <div className="picks">
                   {
                       picks.map((el,i)=>{
                           const m_id_game=el.id_game;
                           const m_type_pick=el.type_pick;
                           const m_team_picked=el.team_picked;
                           const game=all_games.filter((el_g)=>{
                               return el_g.key==m_id_game;
                           })[0];
                           return(
                               <Pick game={game} key={i} pick={el}  dv={sdv} />
                           );
                       })
                   }
               </div>

               <div className="picks_info"></div>

               <div className="modal_actions">
                    <p style={{color:"black"}}>Your current coins is : <span>{my_coins} Coins</span></p>
                    <p style={{color:"black"}}>These picks will cost you <span>{entry} Coins</span></p>
                    

                   {
                       parseInt(my_coins)>= parseInt(entry) && 
                       <div>
                       <button onClick={clear_picks}>Clear All</button>
                       <button onClick={sendPicks}>
                       Confirm Now
                        </button>
                        </div>
                   }
                    {
                       parseInt(my_coins)< parseInt(entry) && 
                       <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                           <p style={{
                               textAlign:"center",
                               fontSize:"0.8rem",
                               color:"indianred",
                               fontWeight:"bold",
                               paddingBottom:"0.5rem"
                           }}>You don't have suffissant coins for these picks</p>
                            <button 
                            onClick={go_to_wallet}
                            className="btn_stats_follow" style={{padding:"1rem"}}>Reload Your Account</button>
                           </div>

                    }
                    
                    {alerte != "" && <p>{alerte}</p>}
                </div>
                </div>}
				startHidden={true}
				buttonElement={
				<button 
                id="btn_open_bottom_sheet"
				style={{
					display:"none",
					alignItems:"center",
					padding:"0.2rem 1rem",
					border:"none",
					outline:"none",
					backgroundColor:"white"
				   }}
				>
				   Trophy Room
				</button>
			   
			}
				/>
                       

            
        </div>
        );
}

export default Join;