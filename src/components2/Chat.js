import "../styles/chat.scss";
import NearMeIcon from '@material-ui/icons/NearMe';
import CloseIcon from '@material-ui/icons/Close';
const Chat=({click})=>{

    return (
        <div className="chat">
            <div className="chat_content"></div>
            <div className="chat_input">
                <button onClick={click}>
                    <CloseIcon />
                </button>
                <input type="text" placeholder="write your message"/>
                <button>
                    <NearMeIcon style={{color:"white"}} />
                </button>
                
            </div>
        </div>
    )
}

export default Chat;