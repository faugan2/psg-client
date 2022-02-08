import "../styles/joined_chat.scss";
import NearMeIcon from '@material-ui/icons/NearMe';
const JoinedChat=()=>{
    return (
        <div className="joined_chat">
            <div className="chat_content">
                messages
            </div>
            <div className="chat_input">
                <input type="text" placeholder="input your message"/>
                <button>
                    <NearMeIcon />
                </button>
            </div>
        </div>
    )
}

export default JoinedChat;