import "../styles/pager_item.scss";
import { auth } from "../firebase_file";
import NearMeIcon from '@material-ui/icons/NearMe';
import CommentIcon from '@material-ui/icons/Comment';
import ReplyIcon from '@material-ui/icons/Reply';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InfoIcon from '@material-ui/icons/Info';
import PeopleIcon from '@material-ui/icons/People';
import {useState,useEffect} from "react";
import {
    selectSports,selectLeagues,selectUsers,selectGames,selectTimeZone,selectGameDate,
    selectDefaultValues
} from "../features/counterSlice";

import {useSelector,useDispatch} from "react-redux";
import logo from "./img/logo.png";
import Match from "./Match";

const moment=require("moment-timezone")

const PagerItem=({index,item,date})=>{
    const {entry,key,league,mode,name,nb_game,sport,type,user}=item;
    
    console.log("the user is ",user);
    const [sport_name,set_sport_name]=useState("");
    const [league_name,set_league_name]=useState("");
    const [str_type,set_str_type]=useState("");
    const [str_mode,set_str_mode]=useState("");
    const [str_entry,set_str_entry]=useState("");
    const [total_players,set_total_players]=useState(0);
    const [creator_name,set_creator_name]=useState("");
    const [creator_icon,set_creator_icon]=useState(null);
    const [psg,set_psg]=useState(true);
    const [data,set_data]=useState([]);
    const [dates,set_dates]=useState([date])
    const [show_ml_spread,set_ml_spread]=useState(null);


    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const u=useSelector(selectUsers);
    const games=useSelector(selectGames);
    const tz=useSelector(selectTimeZone);
    const game_date=useSelector(selectGameDate);
    const default_values=useSelector(selectDefaultValues)

    useEffect(()=>{
        const res2=default_values.filter((item)=>{
            return item.key==league;
        })
        
        if(res2.length>0){
            set_ml_spread(res2[0]);
        }
    },[default_values,league])

    useEffect(()=>{
        const res=l.filter((lg)=>{
            return lg.id==league
            
        })
        if(res.length>0){
            set_league_name(res[0].name)
        }
    },[l])

    useEffect(()=>{
        const res=s.filter((lg)=>{
            return lg.id==sport
        })
        if(res.length>0){
            set_sport_name(res[0].name)
        }
    },[s])

    useEffect(()=>{
        if(type==2){
            set_str_type("Heads Up");
            set_total_players(2);
        }else if(type==3){
            set_str_type("Sports Booth");
            set_total_players(10);
        }else if(type==4){
            set_str_type("Tournament");
            set_total_players(10)
        }
        
    },[type])

    useEffect(()=>{
        if(mode==1){
            set_str_mode("Most Wins");
        }else{
            set_str_mode("Long Win. Str.")
        }
        //set_str_mode(mode);
    },[mode])

    useEffect(()=>{
        set_str_entry(entry);
        if(entry=="0"){
            set_str_entry("Free");
        }else{
            set_str_entry(entry+" coin");
        }
    },[entry]);

    useEffect(()=>{
        if(user==undefined){
            set_creator_name("ProSport.Guru Inc.");
            set_creator_icon(logo);
            set_psg(true)
        }else{
            const res=u.filter((item)=>{
                return item.email==user;
            })
            if(res.length>0){
                set_creator_name(res[0].username);
                set_creator_icon(res[0].photo);
                set_psg(false);
            }
        }
    },[user])



    useEffect(()=>{
        if(league_name==null) return;
        if(games==null || games.length==0) return;

        
        const res=games.filter((item)=>{
            return item.league==league_name;
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
       
        set_data(res_final);
        
       
        

    },[league_name,games]);

    return(
        <div className="pageContainer">
            <div className="content">
                <div className="body">
                    <div className="configurations">
                        <button>
                            {sport_name}
                            <label>sport</label>
                        </button>
                        <button>{league_name}
                            <label>league</label>
                        </button>
                        <button>{str_type}
                            <label>type</label>
                        </button>
                        <button>{str_mode}
                            <label>mode</label>
                        </button>
                        <button>{nb_game}
                            <label>#games</label>
                        </button>
                        <button>{str_entry}
                            <label>entry</label>
                        </button>
                    </div>
                    <div className="players">
                        {/*<div><InfoIcon /></div>
                        <ul>
                            <li>Join this challenge for 
                                {entry==0 ? " free ": ` ${entry} coin`}
                                </li>
                            <li>Make your {nb_game} picks </li>
                            <li>And win   
                            {entry==0 ? " 0.1 coin ": ` up to ${parseInt(entry)*total_players} coin`}
                            </li>
                        </ul>

                        {mode==1 && <div><i>You must have the most wins to gain coins</i></div>}
                        {mode==2 && <div><i>You must have the longest winnings streak to gain the coins</i>
                        </div>}

                        */}
                        <div className="games">
                        {
                            data.map((item,i)=>{
                                const dt=item.date;
                                const matches=item.data;
                                return(
                                    <div key={i}>
                                        <p>{dt}</p>
                                        {
                                            matches.map((match,j)=>{
                                                return(
                                                    <Match 
                                                        key={match.key} 
                                                        match={match}
                                                        show_ml_spread={show_ml_spread}
                                                        click={()=>alert("ok going to select u")}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        </div>
                    
                    </div>
                </div>
                
                <div className="creator">
                   <h4>{name}</h4>
                    <div>
                        <img src={creator_icon}  />
                        <p>{creator_name}</p>
                        {psg==false && <button>Follow</button>}
                    </div>
                </div>
            </div>
            <div className="actions">
                <div className="top">
                    <button>
                        <FileCopyIcon />
                        <p>Clone</p>
                    </button>
                </div>
                <div className="bottom">
                    <button className="join_btn">
                        <NearMeIcon />
                        <label>Join</label>
                    </button>
                    <button>
                        <PeopleIcon />
                        <label>0</label>
                    </button>
                    <button>
                        <CommentIcon />
                        <label>0</label>
                    </button>
                    <button>
                        <ReplyIcon />
                        <label>Share</label>
                    </button>
                </div>
            </div>
        </div>
    );
    
}

export default PagerItem;