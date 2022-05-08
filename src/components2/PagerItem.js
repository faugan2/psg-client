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
    selectSports,selectLeagues
} from "../features/counterSlice";

import {useSelector,useDispatch} from "react-redux";

const PagerItem=({index,item,date})=>{
    const {entry,key,league,mode,name,nb_game,sport,type}=item;

    const [sport_name,set_sport_name]=useState("");
    const [league_name,set_league_name]=useState("");
    const [str_type,set_str_type]=useState("");
    const [str_mode,set_str_mode]=useState("");
    const [str_entry,set_str_entry]=useState("");
    const [total_players,set_total_players]=useState(0);


    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);

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
                        <div><InfoIcon /></div>
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
                        {mode==2 && <div><i>You must have the longest winnings streak to gain the coins</i></div>}
                    </div>
                </div>
                
                <div className="creator">
                    <h4>{name}</h4>
                    <div>
                        <img src={auth?.currentUser?.photoURL}  />
                        <p>{auth?.currentUser?.displayName}</p>
                        <button>Follow</button>
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