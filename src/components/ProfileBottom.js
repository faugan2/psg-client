import "./profile_bottom.scss";
import HistoryIcon from '@material-ui/icons/History';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import TimelineIcon from '@material-ui/icons/Timeline';
import TodayIcon from '@material-ui/icons/Today';
import { useHistory } from "react-router-dom";
const ProfileBottom=({userInfo})=>{
    const history=useHistory();
    const go_to_today=()=>{
        if(userInfo==undefined){
            history.push("/today");
        }else{
            history.push("/today",{userInfo});
        }
        
    }

    const go_to_lockker_room=()=>{
        history.push("/lockerroom");
    }

    const go_to_trophy_room=()=>{
        history.push("/trophyroom");
    }

    const go_to_history=()=>{
        history.push("/history");
    }
    return(
        <div className="profile_bottom">
            
            <button onClick={go_to_today}>
                <TodayIcon/>
                Today's Game
            </button>
            <button onClick={go_to_lockker_room}>
                <TimelineIcon />
                Locker Room
            </button>
            <button onClick={go_to_trophy_room}>
                <LocalCafeIcon />
                Trophy Room
            </button>
            <button onClick={go_to_history}>
                <HistoryIcon />
                History
            </button>
        </div>
    )
}

export default ProfileBottom;