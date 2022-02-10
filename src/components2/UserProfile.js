import "../styles/user_profile.scss";
import TodayIcon from '@material-ui/icons/Today';
import TimelineIcon from '@material-ui/icons/Timeline';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import HistoryIcon from '@material-ui/icons/History';
import InfoIcon from '@material-ui/icons/Info';
const UserProfile=({click})=>{

    const btn_clicked=(index)=>{
        const btns=document.querySelectorAll(".user_profile_bottom>button");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.remove("active");
        }
        btns[index-1].classList.add("active");
    }
    return(
        <div className="user_profile">
            <button onClick={click}>Close</button>

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
                    Locker Room
                </button>
                <button  onClick={btn_clicked.bind(this,4)}>
                    <LocalCafeIcon style={{fontSize:"1.2rem"}}/>
                    Trophy Room
                </button>
                <button  onClick={btn_clicked.bind(this,5)}>
                    <HistoryIcon style={{fontSize:"1.2rem"}}/>
                    History
                </button>
            </div>
        </div>
    )
}
export default UserProfile;