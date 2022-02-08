import "../styles/chat.scss";
import NearMeIcon from '@material-ui/icons/NearMe';
const Chat=()=>{

    return (
        <div className="chat">
            <div className="chat_content"></div>
            <div className="chat_input">
                <input type="text" placeholder="write your message"/>
                <button>
                    <NearMeIcon style={{color:"white"}} />
                </button>
                
            </div>
        </div>
    )
}

export default Chat;