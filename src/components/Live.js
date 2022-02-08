import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setChallenge_date, selectGames,selectChallengeDate, selectLeagues, selectPicks, selectSports, selectTournaments, setSelectedTournament, setSinglePageName } from "../features/counterSlice";
import { challenged_closed, icons } from "../functions";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {db,auth} from "../firebase_file";
import { useHistory } from "react-router-dom";

import GameLine from "./GameLine";
import "./live.scss";
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
 
  
const Live=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const classes = useStyles();

    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const tournaments=useSelector(selectTournaments);
    const picks=useSelector(selectPicks) ;
    const gm=useSelector(selectGames);

    const [sports,setAll_sports]=useState([]);
    const [leagues,setAll_leagues]=useState([]);

    const [selected_sport,setSelected_sport]=useState(0);
    const [selected_league,setSelected_league]=useState(0);
    const [selected_mode,setSelected_mode]=useState(0);

    
    const [play_type,setPlay_type]=useState(0);
    const [entry,setEntry]=useState(0);

    const [games,setAll_games]=useState([])
	const [lives,set_lives]=useState([]);
	const [lives_dates,set_lives_dates]=useState([]);
	const [ordered_lives,set_ordered_lives]=useState([]);
    

    useEffect(()=>{
        setAll_sports(s);
    },[s]);

    useEffect(()=>{
        setAll_leagues(l);
    },[l])

    useEffect(()=>{
        const res=l.filter((i)=>{
            return i.id_sport==selected_sport;
        })
        setAll_leagues(res);
    },[selected_sport]);
    const sport_clicked=(id_sport)=>{
       const btns=document.querySelectorAll(".games_sports>button");
       btns.forEach((btn)=>{
           btn.classList.remove("active");
       })
       const btn=document.querySelector("button[data-idSport='"+id_sport+"']");
       btn.classList.add("active");
       setSelected_sport(id_sport);
       setSelected_league(0);
    }

    const set_play_type=(entry)=>{
        setPlay_type(entry);
        const btns=document.querySelectorAll(".games_btns_free_money > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })

        btns[entry].classList.add("active");
    }

    const set_entry=(index,entry)=>{
        const btns=document.querySelectorAll(".games_btns_entries>button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        btns[index].classList.add("active");
        setEntry(entry);
    }

    const [loading_game,set_loading_game]=useState(true);

    useEffect(()=>{
        set_loading_game(true);
        
        set_loading_game(false);
        setAll_games(tournaments);
    },[selected_sport,tournaments]);
	
	useEffect(()=>{
		
		
		const res=games.filter((row)=>{
			
			const row_sport=row.sport;
			const row_league=row.league;
			const row_mode=row.mode;
			const key=row.key;
			
			let league_name="";
			league_name=l.filter((lg)=>{
				return lg.id==row_league;
			})[0]?.name;
			
			
			
			 const res=picks.filter((pick)=>{
			   return pick.id_challenge==key;
			})
			
			let user_made_picks=false;
		   res.forEach((r)=>{
			  if(r.user==auth?.currentUser.email){
				  user_made_picks=true;
			  }
		   })

		   let challenged=row.challenged;
		   
		   if(user_made_picks==false){
		   if(challenged){
			
			if(row.friend.indexOf(auth?.currentUser.email)<0){

				if(row.user!=auth?.currentUser.email){
					return false;
				}
				
			}else{
				
			}
		   }else{
			return false;
		   }
		   
		}
		
		
		const nb_player=res.length;
	   if(nb_player==0 && challenged==false){
		   return false;
	   }
	   
	   const fee=row.fee;
	   let winning=0;
	   if(fee==0){
			winning=100;
	   }else{
			winning=parseInt(fee)*nb_player;
	   }
	   
		let str_player="";
	   const type=row.type;
	   if(type=="1"){
		   return false;
	   }
	   
	   if(type=="2"){
		   str_player=nb_player+"/2";
	   }else if(type=="3"){
		   str_player=nb_player+"/10";
	   }else if(type=="5"){
			str_player=nb_player+"/"+(row.friend?.length+1);
	   }else{
			str_player=nb_player;
	   }
	   
	   let {closed,game_started}=challenged_closed(key,type,nb_player,res,gm);
	   
	   let icon_name=null;
	   const res_icon=icons.filter((icon)=>{
		   return icon.id==row_sport;
	   })
	   if(res_icon.length>0){
		   icon_name=res_icon[0].icon;

	   }
		
	   console.log("the resu row 1d=",row.challenge_results);
		if(row.challenge_results!==undefined){
			console.log("the resu row 1d is undefined ok here we go",row.key);
			return false;
		}
		
		
		
		return true;
			
		})
		
		console.log("the res is ",res);
		const dates=[];
		const res2=res.map((row)=>{
			console.log("the resu row",row);
			const row_sport=row.sport;
			const row_league=row.league;
			const row_mode=row.mode;
			const key=row.key;
			
			const res=picks.filter((pick)=>{
			   return pick.id_challenge==key;
			})
			
			const nb_player=res.length;
			const fee=row.fee;
		   
		   let winning=0;
		   if(fee==0){
				winning=100;
		   }else{
				winning=parseInt(fee)*nb_player;
		   }
		   let str_player="";
			const type=row.type;
		    if(type=="2"){
			   str_player=nb_player+"/2";
		   }else if(type=="3"){
			   str_player=nb_player+"/10";
		   }else if(type=="5"){
				str_player=nb_player+"/"+(row.friend?.length+1);
		   }else{
				str_player=nb_player;
		   }
		   
		   let {closed,game_started}=challenged_closed(key,type,nb_player,res,gm);
		   
		   let icon_name=null;
		   const res_icon=icons.filter((icon)=>{
			   return icon.id==row_sport;
		   })
		   if(res_icon.length>0){
			   icon_name=res_icon[0].icon;

		   }
		   let str_date=new Date(row.date?.seconds*1000).toUTCString();
		   str_date=str_date.split(" ");
		   str_date=str_date[1]+ " "+str_date[2]+ " "+str_date[3];
		   
		   
		   if(lives_dates.indexOf(str_date)<0){
			   dates.push(str_date);
			   //set_lives_dates([...lives_dates,str_date]);
		   }
		   
		   let league_name2="";
			league_name2=l.filter((lg)=>{
				return lg.id==row_league;
			})[0]?.name;
		   
		   const temp={...row,icon_name,closed,game_started,winning,str_player,str_date,league_name:league_name2};
		   return temp;
		   console.log("the resu tmp=",temp);
			
		
		})
		set_lives_dates(dates);
		console.log("the resu ",dates);
		set_lives(res2);
	},[games])
	
	
	useEffect(()=>{
		const deja=[];
		const res=lives_dates.map((date)=>{
			if(deja.indexOf(date)<0){
				deja.push(date);
				const games=lives.filter((row)=>{
					return row.str_date==date;
				})
			
				return {date,games};
			}else{
				return null;
			}
			
			//set_ordered_lives([...ordered_lives,{date,games}]);
			//console.log("the resu fdrom f",ordered_lives);
			
		})
		const res2=res.filter((item)=>{
			return item!=null;
		})
		console.log("the resu is",res);
		set_ordered_lives(res2);
	},[lives_dates])

    const go_to_tournament=(key,game_started,closed)=>{
		
		
        const t= tournaments.filter((line)=>{
            return line.key==key;
        })
        if(t.length>0){
            const selected_t=t[0];
			const d=new Date(selected_t.date?.seconds*1000);
			dispatch(setChallenge_date(d));
            const el={...selected_t,closed,started:game_started};
            dispatch(setSelectedTournament(el));
            dispatch(setSinglePageName(el.name));
            history.push("/challenge");
            
        }
    }

    const [empty,setEmpty]=useState(true);

    const [live_picks,set_live_picks]=useState([]);
    useEffect(()=>{
        const my_email=auth?.currentUser.email;
        const res=picks.filter((pick)=>{
            return pick.user==my_email;
        })

        const res2=res.filter((item)=>{
            return item.results==undefined || item.results==null || item.results?.length==0;
        })
        set_live_picks(res2);
    },[picks]);

    const share_app=async ()=>{
        try{
            await navigator.share({
                 title:"Share ProSport Guru App with friends",
                 url:"https://prosport-guru.web.app",
                 text:"Let's use ProSport Guru, a simple and secure App to earn money and having fun at same time"
             })
             //console.log("share successful")
        }catch(err){
            //console.log(err);
        }
     }
   
     let cpt=0;
    
     const scd=useSelector(selectChallengeDate);
     const [calenda,set_calenda]=useState(scd);
     useEffect(()=>{
        set_calenda(scd);
     },[scd]);
    
	 const go_to_invited_users=(tournament)=>{
		 console.log(tournament);
	 }
    return(
        <div className="lives">

            <div className="games_body" style={{paddingTop:"0"}}>
            
			
			{
				ordered_lives.map(({date,games})=>{
					
					console.log("orderred games are ",games)
					return(
						<div key={date} className="live">
							<p>{date}</p>
							{
								games.map((row)=>{
								
									return(
										<GameLine 
										key={row.key}
										go_to_tournament={go_to_tournament.bind(this,row.key,row.game_started,row.closed)}
										icon_name={row.icon_name}
										name={row.name}
										league_name={row.league_name}
										nb_game={row.nb_game}
										winning={row.winning}
										str_player={row.str_player}
										show_play_btn={false}
										fee={row.fee}
										type={row.type}
										multiple={row.multiple}
										dates={row.dates}
										invited={true}
										go_to_invited_users={go_to_invited_users.bind(this,row)}
									   />
									)
								})
							}
						</div>
					);
					
					/*const res=res_lives.map((row)=>{
						console.log("find ",row);
						return(
							<div>
							<p>{row.str_date}</p>
							<GameLine 
							go_to_tournament={go_to_tournament.bind(this,row.key,row.game_started,row.closed)}
							icon_name={row.icon_name}
							name={row.name}
							league_name={row.league_name}
							nb_game={row.nb_game}
							winning={row.winning}
							str_player={row.str_player}
							show_play_btn={false}
							fee={row.fee}
							type={row.type}
							
						   />
						   </div>
						);
					})*/
					
					 
				})
			}
               
              
               

               
                

            {
                lives.length==0 && 
                
                <div  className="alerte">
                    <p style={{textAlign:"center"}}>No records founds!</p>
                </div>
            }
           
            </div>
         
        </div>
    );
}

const useStyles = makeStyles({
    table: {
      maxWidth: "100%",
    },
    empty:{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        height:"50vh",
        gap:"0.5rem",
        alignItems:"center",
        flex:1,
        "& > h1":{
            fontSize:"1.1rem"
        },
        " & > p":{
            fontSize:"0.9rem",
            textAlign:"center",
            fontWeight:"600",
            color:"black",
        },
        "& > button":{
            width:"100%",
            padding:"1rem",
            border:"none",
            outline:"none",
            cursor:"pointer",
            backgroundColor:"indianred",
            color:"white",
            fontWeight:"500",
            marginTop:"0.5rem",
            marginBottom:"0.5rem",
        },
        "& > .p_gray":{
            color:"gray",
            fontWeight:"400"
        }
    }
  });

export default Live;