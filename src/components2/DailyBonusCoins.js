import "../styles/not_enough_coins.scss";
import HeaderBottomSheet from "./HeaderBottomSheet";
import ClearIcon from '@material-ui/icons/Clear';
import {auth} from "../firebase_file";
import {useSelector,useDispatch} from "react-redux";
import {selectJoin,selectTransactions,setNotEnoughCoins} from "../features/counterSlice";
import {user_coins} from "./data";
import {useHistory} from "react-router-dom";

const NotEnoughCoins=({click})=>{
    const transactions=useSelector(selectTransactions);
    const join=useSelector(selectJoin);
    const coins=user_coins(auth?.currentUser?.email,transactions);
    const history=useHistory();
    const dispatch=useDispatch();
    
    return(
        <div className="not_enough_coins">
           <div className="content">
            <p>
                You just earn 1 coin for visiting Prosport.Guru App today
            </p>

           
           </div>
          
           <HeaderBottomSheet title="Contratulations !!!">
                <button onClick={click}>
                    <ClearIcon />
                </button>
           </HeaderBottomSheet>
            
        </div>
    )
}

export default NotEnoughCoins;