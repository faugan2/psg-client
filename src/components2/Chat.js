import "../styles/chat.scss";
import NearMeIcon from '@material-ui/icons/NearMe';
import CloseIcon from '@material-ui/icons/Close';
import HeaderBottomSheet from "./HeaderBottomSheet";

const Chat=({click})=>{

    const saisie=(e)=>{
        const v=e.target.value;
        console.log(v);
    }
    return (
        <div className="chat">
            <div className="chat_content"></div>
            <div className="chat_input">
                
                <input type="text" placeholder="write your message" autoFocus={false} 
                onChange={saisie} />
                <button>
                    <NearMeIcon style={{color:"green"}} />
                </button>
                
            </div>

            <HeaderBottomSheet title="Global Chat">
                <button onClick={click}>
                        <CloseIcon />
                    </button>
            </HeaderBottomSheet>
        </div>
    )
}

export default Chat;