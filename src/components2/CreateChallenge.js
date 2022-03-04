import "../styles/create_challenge.scss";
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import CreateChallengeOptions from "./createChallengeOptions";
import CreateChallengeFriends from "./CreateChallengeFriends";
import {useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import {selectSports,selectLeagues,selectLeaguePageOptions} from "../features/counterSlice";
import DateRangeIcon from '@material-ui/icons/DateRange';
import CreateChallengeDate from "./CreateChallengeDate";
import NearMeIcon from '@material-ui/icons/NearMe';
import HeaderBottomSheet from "./HeaderBottomSheet";

const CreateChallenge=({click,resume})=>{
    const [page,set_page]=useState(1);
    const [league,set_league]=useState("");

    const sports=useSelector(selectSports);
    const leagues=useSelector(selectLeagues);
    const options=useSelector(selectLeaguePageOptions);

    useEffect(()=>{
        const l=leagues.filter((item)=>{
            return item.id==options.id_league;
        })
        if(l.length>0){
            set_league(l[0].name);
        }
        
    },[leagues,options])

   


    const change_page=(id)=>{
       const btns=document.querySelectorAll(".create_footer>button");
       for(var i=0; i<btns.length; i++){
           btns[i].classList.remove("active");
       }
       btns[id-1].classList.add("active");
       set_page(id);
    }
    return(
        <div className="create_challenge">
           
           <button onClick={e=>{
               click();
               resume();
           }} className="create_submit_btn">
               <NearMeIcon style={{fontSize:"1.2rem",color:"white"}} />
           </button>
          
           <div className="create_content">
               {page==1 && <CreateChallengeOptions />}
               {page==3 && <CreateChallengeFriends />}
               {page==2 && <CreateChallengeDate />}
           </div>
           <div className="create_footer">
               <button className="active" onClick={change_page.bind(this,1)}>
                   <SettingsIcon style={{fontSize:"1.2rem"}} />
                   Options</button>
                
                <button onClick={change_page.bind(this,2)}>
                    <DateRangeIcon style={{fontSize:"1.2rem"}} />
                    Date
                </button>
               <button onClick={change_page.bind(this,3)}>
                   <PeopleIcon style={{fontSize:"1.2rem"}} />
                   Invite Friends</button>
           </div>

           <HeaderBottomSheet title={`Create a new challenge : ${league}`}>
            <button onClick={click} className="create_close_btn">
                <CloseIcon style={{fontSize:"1.2rem",color:"white"}} />
            </button>
           </HeaderBottomSheet>
        </div>
    );
}

export default CreateChallenge;