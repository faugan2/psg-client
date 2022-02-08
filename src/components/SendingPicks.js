import "../styles/sending_picks.scss";
import CircularProgress from '@material-ui/core/CircularProgress';

const SendingPicks=()=>{
    return (
        <div className="sending_picks">
            <p>Please wait...</p>
            <CircularProgress size={15} style={{color:"black"}}/>
        </div>
    )
}

export default SendingPicks;