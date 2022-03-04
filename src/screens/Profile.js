import "../styles/user_profile.scss";
import TodayIcon from '@material-ui/icons/Today';
import TimelineIcon from '@material-ui/icons/Timeline';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import HistoryIcon from '@material-ui/icons/History';
import InfoIcon from '@material-ui/icons/Info';
import {useSelector,useDispatch} from "react-redux";
import {selectUserProfile,setUserProfile,selectUsersStats,selectPicks,selectTransactions} from "../features/counterSlice";
import CloseIcon from '@material-ui/icons/Close';
import { useState,useEffect } from "react";
import UserProfileInfo from "../components2/UserProfileInfo";
import UserProfileTodaysGame from "../components2/UserProfileTodaysGame";
import UserProfileLockerRoom from "../components2/UserProfileLockerRoom";
import UserProfileHistory from "../components2/UserProfileHistory";
import HeaderBottomSheet from "../components2/HeaderBottomSheet";
import {user_stats,user_matches_picks,user_coins} from "../components2/data";
import {useHistory} from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const UserProfile=({click})=>{

    const history=useHistory();
    const email=useSelector(selectUserProfile);
    const us=useSelector(selectUsersStats);
    const picks=useSelector(selectPicks);
    const all_transactions=useSelector(selectTransactions);
    const stats=user_stats(email,us);
    const nb_matches_picks=user_matches_picks(email,picks);
    const coins=user_coins(email,all_transactions)
    
    const [page,set_page]=useState(1);

    const btn_clicked=(index)=>{
        set_page(index);
        const btns=document.querySelectorAll(".user_profile_bottom>button");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.remove("active");
        }
        btns[index-1].classList.add("active");
    }
    
    return(
        <div className="user_profile">
            <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <h2>Profile</h2>
            </div>

                <div className="content">
                {page==1 && <UserProfileInfo 
                stats={stats} 
                nb_matches_picks={nb_matches_picks}
                coins={coins}
                />}
                {page==2 && <UserProfileTodaysGame />}
                {page==3 && <UserProfileLockerRoom  nb_matches_picks={nb_matches_picks}/>}
                {page==4 && <UserProfileHistory />}
                </div>
           
           
           

            <div className="user_profile_bottom">
                <button className="active" onClick={btn_clicked.bind(this,1)}>
                    <InfoIcon style={{fontSize:"1.2rem"}} />
                    Info
                </button>
                <button onClick={btn_clicked.bind(this,2)}> 
                    <TodayIcon style={{fontSize:"1.2rem"}}/>
                    Today's Game
                </button>
                <button  onClick={btn_clicked.bind(this,3)}>
                    <TimelineIcon style={{fontSize:"1.2rem"}}/>
                    Loc.Room
                </button>
                <button  onClick={btn_clicked.bind(this,4)}>
                    <HistoryIcon style={{fontSize:"1.2rem"}}/>
                    History
                </button>
            </div>

            
        </div>
    )
}
export default UserProfile;