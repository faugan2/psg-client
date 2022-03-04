import "../styles/profile.scss";
import InfoIcon from '@material-ui/icons/Info';
import TodayIcon from '@material-ui/icons/Today';
import HistoryIcon from '@material-ui/icons/History';
import TimelineIcon from '@material-ui/icons/Timeline';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
const Profile=({click})=>{
    return (
        <div className="profile">

            <div className="profile_footer">
                <button className="active">
                    <InfoIcon style={{fontSize:"1.2rem"}} />
                    INfo
                </button>
                <button>
                    <TodayIcon style={{fontSize:"1.2rem"}}/>
                    Today
                </button>
                <button>
                    <HistoryIcon style={{fontSize:"1.2rem"}}/>
                    History
                </button>
                <button>
                    <TimelineIcon style={{fontSize:"1.2rem"}}/>
                    Loc.Room
                </button>
                <button>
                    <AttachMoneyIcon style={{fontSize:"1.2rem"}}/>
                    Wallet
                </button>
            </div>

            <button onClick={click}>close</button>
        </div>
    )
}
export default Profile;