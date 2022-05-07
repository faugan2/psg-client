import "../styles/pager_item.scss";
import { auth } from "../firebase_file";
import NearMeIcon from '@material-ui/icons/NearMe';
import CommentIcon from '@material-ui/icons/Comment';
import ReplyIcon from '@material-ui/icons/Reply';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FileCopyIcon from '@material-ui/icons/FileCopy';
const PagerItem=({index,item})=>{
    return(
        <div className="pageContainer">
            <div className="content">
                <div className="body">
                    <div className="configurations">
                        <button>baseball</button>
                        <button>mlb</button>
                        <button>heads up</button>
                        <button>most wins</button>
                        <button>3 games</button>
                        <button>free</button>
                    </div>
                    <div className="players">
                        players {index}
                    </div>
                </div>
                
                <div className="creator">
                    <h4>PS.G Baseball Heads Up 3</h4>
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
                    <button>
                        <NearMeIcon />
                        <label>Join</label>
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