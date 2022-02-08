import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { selectFriendChallenged, selectLeagues, selectSports,
    selectInvitedFriend,
    selectUsers,
    selectFollow,
	setChallenge_date,
    setChallenge_dates,
    selectTimeZone,
	selectChallengeDate,
    setSelectedGames, setSelectedTournament, setTodayTime, setInvitedFriends, setMultipleFriend, selectChallengeDates } from '../features/counterSlice';
import HeaderBack from "./HeaderBack"
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {makeStyles} from "@material-ui/core/styles";
import { Switch } from '@material-ui/core';
import firebase from "firebase";
import { db,auth } from '../firebase_file';
import {useDispatch} from "react-redux";
import nextId from "react-id-generator";
import Avatar from '@material-ui/core/Avatar';
import { v4 as uuidv4 } from 'uuid';

import {useHistory} from "react-router-dom";
import { get_today_time } from '../functions';
import Challengefriendprevnextbtns from './ChallengeFriendPrevNextBtns';
import DatePicker from "react-horizontal-datepicker";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { render } from "react-dom";

/**
 * You need this for icons to work!
 */
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import BottomSheet from "./BottomSheet";

import ListFriends from "./ListFriends";
import "./header2.scss";
import "./Challengefriend.scss";
import DeleteIcon from '@material-ui/icons/Delete';
const moment=require("moment-timezone");


 const ChallengeFriend = () => {
    
    const d=useSelector(selectFriendChallenged);
    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const users=useSelector(selectUsers);
    const follow=useSelector(selectFollow);
    const [my_club,set_my_club]=useState([]);

    const [data,setData]=useState(null);
    const [sport,set_sport]=useState(0);
    const [league,set_league]=useState(0)
    const [leagues,set_leagues]=useState([]);
    const [league_name,set_league_name]=useState("");
    const [mode,set_mode]=useState(0);
    const [type,set_type]=useState(0);
    const [real,set_real]=useState(false);
    const [entry,set_entry]=useState(0);
    const [game_number,set_game_number]=useState(0);
	const [challenge_name,set_challenge_name]=useState("");
    const fi=useSelector(selectInvitedFriend);
	const select_challenge_date=useSelector(selectChallengeDate);

    const dispatch=useDispatch();
    const history=useHistory();


    useEffect(()=>{
        setData(d);
    },[d]);

    const styles=useStyles();

    const create_challenge=async (e)=>{
		console.table(fi);
        if(sport==0){
            alert("Please select a sport");
            return;
        }
        if(league==0){
            alert("Please select a league");
            return;
        }
        if(mode==0){
            alert("Please select a game mode");
            return;
        }
        if(type==0){
            //alert("Please select a game type");
           //// return;
        }
        if(game_number==0){
            alert("Please select a number of game");
            return;
        }
        const btn=e.target;
        btn.innerHTML="Please wait...";
        btn.disabled=true;

        const rl=leagues.filter((item)=>{
            return item.id==league;
        })
        //console.log("league found is ",rl);
        set_league_name(rl[0]?.name);

        const res=await  db.collection("psg_today").doc("date").get();
         const today=res.data().date.seconds;

        const z_data=[
            {
               date:today,
               state:0,
               picks:[]
            }
        ]

        const friends=fi.map((item)=>{
            return item.email;
        })

        let type2=2;
        if(fi.length==1){
            type2=2;
        }else if(fi.length>1){
            type2=3;
        }
        const challenge={user:auth?.currentUser.email,entry,league,sport,mode,type:type2,
            number_game:game_number,url:"",name:challenge_name,z_data,challenged:true,friend:fi,
			date:select_challenge_date,
            multiple,dates
			};
        ////console.log(friends);

        const ref=uuidv4();
        
        db.collection("psg_challenges").doc(ref).set(challenge).then(()=>{
            
            const ch={...challenge,key:ref};
            
            dispatch(setSelectedTournament(ch));
            dispatch(setInvitedFriends([]));
            dispatch(setMultipleFriend(false))
            //console.log("league name is ",league_name);

            db
            .collection("psg_games")
            .where("league","==",league_name)
            .onSnapshot(async (snap)=>{
                const g=[];
                //console.log("we are going to list data ",snap.docs.length)
                snap.docs.map((doc)=>{
                    const id=doc.id; 
                    const data=doc.data();
                    const date=data.date.seconds;
                    data.date=date;
                    data.key=id;
                    g.push(data);
                    //console.log(data);
                })
 
                //setGames(g);
                dispatch(setSelectedGames(g));

                const today_time=await get_today_time();
                dispatch(setTodayTime(today_time));
                /*await db.collection("psg_today").doc("date").set({date:firebase.firestore.FieldValue.serverTimestamp()});
                const res_date=await db.collection("psg_today").doc("date").get();
                const today_date=res_date.data().date;
                const today_time=today_date?.seconds*1000;*/
                

                btn.disabled=false;
                btn.innerHTML="Create Challenge Now";
                history.replace("/join");
                
            })

        }).catch((err)=>{
            alert(err.message);
            btn.disabled=false;
            btn.innerHTML="Create Challenge Now";
        });
    }

    const [etape,set_etape]=useState(0);
    useEffect(()=>{
        const etapes=document.querySelectorAll(".etape");
        etapes.forEach((e)=>{
            e.style.display="none";
        })
        etapes[etape].style.display="block";
    },[etape]);

    const handle_prev=()=>{
        set_etape(etape-1);
    }

    const handle_next=()=>{
        set_etape(etape+1);
    }

    const [invited_friends,set_invited_friends]=useState([]);
    const [user_list,set_user_list]=useState(null);
    useEffect(()=>{
        const res=users.filter((user)=>{
            return fi.indexOf(user.email)>=0;
        })
        set_invited_friends(res);
        
        const res2=follow.filter((user)=>{
           return user.user==auth?.currentUser?.email;
        })
        set_my_club(res2);

        let tmp=null;
        res2.map((user)=>{
           
            tmp+=<div>
                    <img src={user.photo} style={{width:"3rem",height:"3rem",borderRadius:"50%"}}/>
                    
            </div>;
        })
        console.log(tmp);
        set_user_list(<tmp />);
    },[fi,users,follow]);

    const time_zone=useSelector(selectTimeZone);
    const [dates,set_dates]=useState([]);
    const selectedDay = (val) =>{
        console.log(val);
        dispatch(setChallenge_date(val));
        const new_dates=[...dates];
        const time=val.getTime();   
        const date=moment.tz(time,time_zone).format("ll");
        if(dates.indexOf(date)<0){
            new_dates.push(date);
        }
        set_dates(new_dates);
        dispatch(setChallenge_dates(new_dates))
      };

     
      
      
      const scd=useSelector(selectChallengeDates);
      const [calenda,set_calenda]=useState(new Date());
    
      useEffect(()=>{
       console.log("the challenge date is ",scd)
      },[scd]);

	  const remove_user=(user)=>{
		  const email=user.email;
		  const res=fi.filter((item)=>{
			  return item !=user.email;
		  })
		  
		  dispatch(setInvitedFriends(res));
	  }
      

     
      const [multiple,set_multiple]=useState(false);
      const delete_date=(date)=>{
         const new_dates=dates.filter((item)=>{
             return item!=date;
         })
         set_dates(new_dates);
      }
    return (
        <div style={{backgroundColor:"whitesmoke",minHeight:"100vh",position:"relative"}}>
            <HeaderBack 
                title_redux={false} 
                title={`Create Challenge`}
				show_menu={false}
				show_empty_div={true}
                >
                    {
                       /* data?.photo=="foo.jpg" && null*/
                    }
                   {/*data?.photo !="foo.jpg" &&  
                   <img src={data?.photo}  style={{width:"3rem",height:"3rem",borderRadius:"50%",
                   position:"absolute",right:"1rem"
                   }}/>*/} 
                </HeaderBack>

                
                
                <div>
                <div className="etape">
                <div style={{display:"flex",alignItems:"center",width:"50%",margin:"auto"}}>
                        
                    <Switch
                        checked={multiple}
                        onChange={e=>{
                            console.log(multiple);
                            set_multiple(!multiple);
                        }}
                        name="checkedB"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                        <p style={{fontSize:"0.8rem"}}>Multiple date</p>
                    </div> 

                    <div
                        className="zone_date_picker"
                    style={{}}>
                    <DatePicker getSelectedDay={selectedDay}
                        
                        endDate={50}
                        selectDate={calenda}
                        labelFormat={"MMM yyyy"}
                        color={"indianred"}  
                            
                    />
                    </div>

                    {
                        multiple==true && <div style={{margin:"1rem"}}>
                                {
                                    dates.map((item)=>{
                                        return(
                                            <div className="challenge_date_line">
                                                <p>{item}</p>
                                                <button onClick={delete_date.bind(this,item)}>
                                                    <DeleteIcon style={{color:"gray"}} /></button>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                    }

                <Challengefriendprevnextbtns
                        btnPrev={false}
                        btnNext={true}
                        btnCreate={false}
                        handle_create={create_challenge}
                        handle_prev={handle_prev}
                        handle_next={handle_next}
                    />
                </div>
                


                <div className="etape">
                        <div className={styles.line}>
                            <label>Game Type</label>
                            <Select value={type} onChange={e=>set_type(e.target.value)}>
                                <MenuItem value={0}>Select Game Type</MenuItem>
                                <MenuItem value={1}>Heads Up Wins</MenuItem>
                                <MenuItem value={2}>Sports Booth</MenuItem>
                               
                            </Select>
                        </div>
						
						<div className={styles.line}>
							<label>Challenge Name</label>
							<input type="text"
							placeholder="Enter the challenge name"
						
							value={challenge_name} onChange={e=>set_challenge_name(e.target.value)} />
						</div>

                        <Challengefriendprevnextbtns
                        btnPrev={true}
                        btnNext={true}
                        btnCreate={false}
                        handle_create={create_challenge}
                        handle_prev={handle_prev}
                        handle_next={handle_next}
                    />
                     </div>
                    <div className="etape">
                    <div className={styles.line}>
                        <label>Select a Sport</label>
                        <Select value={sport} onChange={e=>{
                            set_sport(e.target.value);

                            const res=l.filter((item)=>{
                                return item.id_sport==e.target.value;
                            })

                            set_leagues(res);
                            
                            }}>
                            <MenuItem value={0}>Select Your Sport</MenuItem>
                            {
                                s.map((sport)=>{
                                    return(
                                        <MenuItem key={sport.key} value={sport.id}>{sport.name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </div>

                    <div className={styles.line}>
                        <label>Select a League</label>
                        <Select value={league} onChange={e=>set_league(e.target.value)}>
                            <MenuItem value={league}>Select Your League</MenuItem>
                            {
                                leagues.map((league)=>{
                                    return(
                                        <MenuItem key={league.key} value={league.id}>{league.name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </div>

                    <Challengefriendprevnextbtns
                        btnPrev={true}
                        btnNext={true}
                        btnCreate={false}
                        handle_create={create_challenge}
                        handle_prev={handle_prev}
                        handle_next={handle_next}
                    />

                    </div>
                    <div className="etape">
                    <div className={styles.line}>
                        <label>Game Mode</label>
                        <Select value={mode} onChange={e=>set_mode(e.target.value)}>
                            <MenuItem value={0}>Select Game Mode</MenuItem>
                            <MenuItem value={1}>Most Wins</MenuItem>
                            <MenuItem value={2}>Longest Winning Streak</MenuItem>
                        </Select>
                    </div>

                    


                    <div className={styles.line}>
                        <label>Game Number</label>
                        <Select value={game_number} onChange={e=>set_game_number(e.target.value)}>
                            <MenuItem value={0}>Select Game number</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                        </Select>
                    </div>

                    <Challengefriendprevnextbtns
                        btnPrev={true}
                        btnNext={true}
                        btnCreate={false}
                        handle_create={create_challenge}
                        handle_prev={handle_prev}
                        handle_next={handle_next}
                    />
                    </div>

                    <div className="etape">

                    <div style={{display:"flex",alignItems:"center",width:"80%",margin:"auto"}}>
                        <p className="active" style={{fontSize:"0.8rem"}}>Free to Play</p>
                    <Switch
                        checked={real}
                        onChange={e=>{
                            set_real(!real);
                            if(real==true){
                                set_entry(0)
                            }else{
                                set_entry(1)
                            }
                            
                        }}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                        <p style={{fontSize:"0.8rem"}}>Real Money Play</p>
                    </div> 

                   

                    {
                        real==false &&  
                        <div className="games_btns_entries" style={{width:"80%",margin:"auto"}}>
                            <button className={entry==0 ? "active":""} onClick={e=>set_entry(0)}>Free</button>
                            <button className={entry==1000 ? "active":""} onClick={e=>set_entry(1000)}>1,000 Coins</button>
                            <button className={entry==2000 ? "active":""} onClick={e=>set_entry(2000)}>2,000 Coins</button>
                            <button className={entry==5000 ? "active":""} onClick={e=>set_entry(5000)}>5,000 Coins</button>
                        </div>
                    }

{
                        real==true &&  
                        <div className="games_btns_entries" style={{width:"80%",margin:"auto"}}>
                            <button style={{display:"none"}} className={entry==0 ? "active":""} onClick={e=>set_entry(0)}>Free</button>
                            <button className={entry==1 ? "active":""} onClick={e=>set_entry(1)}>$1</button>
                            <button className={entry==2 ? "active":""} onClick={e=>set_entry(2)}>$2</button>
                            <button className={entry==5 ? "active":""} onClick={e=>set_entry(5)}>$5</button>
                        </div>
                    }

                    <Challengefriendprevnextbtns
                        btnPrev={true}
                        btnNext={true}
                        btnCreate={false}
                        handle_create={create_challenge}
                        handle_prev={handle_prev}
                        handle_next={handle_next}
                    />
                     </div>

                    
                     
                    <div className="etape">
                        <div className={styles.line}>

                            <div style={{
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"space-between",
                                backgroundColor:"white",
                                width:"100%",
                            }}>
                            <button style={{
								  color:"indianred",
									fontWeight:"bold",
                                    fontSize:"0.7rem",
                                    backgroundColor:"white",
                                    border:"none",
                                    outline:"none",
							 }}>Invited Players({invited_friends.length})</button>

                            <BottomSheet
                                content={<ListFriends />}
                                startHidden={true}
                                buttonElement={
                                <button 
                                id="btn_invite_player"
                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    padding:"0.5rem",
                                    border:"none",
                                    outline:"none",
                                    backgroundColor:"white",
                                    flexDirection:"column",
                                    color:"gray",
                                    
                                   }}
                                >
                                   <PersonAddIcon />
                                   
                                </button>
                               
                            }
                                />

                            </div>


                            {
								invited_friends.length==0 && 
								<div style={{
                                    display:"flex",
                                    flexDirection:"column",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    justifyContent:"center",
                                    margin:"1rem",
                                    }}>
								<p style={{
                                color:"gray",
                                fontSize:"0.7rem",textAlign:"center"}}>
									No player is invited
								</p>

                                <button style={{
                                    marginTop:"1rem",
                                    padding:"0.5rem",
                                    border:"1px solid silver",
                                    backgroundColor:"white",
                                    fontSize:"0.7rem",
                                    borderRadius:"5px",
                                    fontWeight:"bold",
                                    display:"flex",
                                    flexDirection:"column",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    color:"gray",

                                }}
                                onClick={e=>{
                                    document.querySelector("#btn_invite_player").click();
                                }}
                                >
                                    <PersonAddIcon />
                                    Invite a player now</button>
                                </div>
							}

                            
								{invited_friends.length > 0 &&<div style={{
									display:"flex",
									flexWrap:"wrap",
										gap:"1rem",
										marginTop:"1rem",
                                        backgroundColor:"white",
                                        padding:"1rem",
									}}
									
								>
                           
                            {
                                invited_friends.map((user)=>{
                                    return (
                                        <div key={user.email}
										style={{
											display:"flex",
											flexDirection:"column",
											alignItems:"center",
											justifyContent:"center",
										}}
										
										onClick={remove_user.bind(this,user)}
										>
                                            <img src={user.photo}  
                                            style={{width:"2.5rem",height:"2.5rem",borderRadius:"50%"}}
            
                                            />
                                            <p
											style={{
												fontSize:"0.8rem",
												width:"60px",
												whiteSpace:"nowrap",
												overflow:"hidden",
												textOverflow: "ellipsis",
												textAlign:"center"
											}}
											>{user.username}</p>
                                        </div>
                                    );
                                })
                            }
							</div>
                            }
                        </div>
                        <div style={{
                            width:"80%",
                            margin:"auto",
                            display:"flex",
                            alignItems:"center",
                            

                        }}>
                             <Challengefriendprevnextbtns
                                btnPrev={true}
                                btnNext={false}
                                btnCreate={true}
                                handle_create={create_challenge}
                                handle_prev={handle_prev}
                                handle_next={handle_next}
                            />
                        

                   

                        </div>
                    </div>

                    
                   


                </div>
        </div>
    )
}

const useStyles=makeStyles({
    line:{
        display:"flex",
        flexDirection:"column",
        width:"80%",
        margin:"auto",
        padding:"1rem",
        fontSize:"1rem",
        marginBottom:"1rem",
        "& > label":{
            color:"indianred",
            fontWeight:"bold",
            fontSize:"0.8rem",
        },
		"& > input[type=text]":{
			border:"none",
			borderBottom:"1px solid silver",
			fontSize:"0.7rem",
			fontSize:"bold",
			fontFamily:"roboto",
			marginTop:"0.3rem",
			outline:"none",
            padding:"0.6rem",
            color:"rgba(0,0,0,087)",
		}
    }
})

export default ChallengeFriend;