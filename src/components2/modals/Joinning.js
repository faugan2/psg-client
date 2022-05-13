import "../../styles/joinning.scss";
import {auth,db} from "../../firebase_file";
import CloseIcon from '@material-ui/icons/Close';
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectJoin,selectSelectedPicks,selectTransactions} from "../../features/counterSlice";

import JoinningAuthAlert from "../JoinningAuthAlert";
import {user_coins} from "../data";
import JoinningNotEnougthCoins from "../JoinningNotEnougthCoins";
import CircularProgress from '@material-ui/core/CircularProgress';

const Joinning=({close})=>{
    const [state,set_state]=useState(0);
    const [entry,set_entry]=useState(0);
    const [coins,set_coins]=useState(0);

    const picks=useSelector(selectSelectedPicks);
    const challenge=useSelector(selectJoin);
    const transactions=useSelector(selectTransactions);


    useEffect(()=>{
        const sub=auth.onAuthStateChanged((user)=>{
            if(user==null){
                set_state(0);
            }else{
                const c=user_coins(auth.currentUser?.email,transactions);
                set_coins(c);
                if(c<parseInt(challenge?.entry)){
                    set_state(1);   
                    return ;
                }

                set_state(2);
            }
        })

        return sub;
    },[])
    
    /*useEffect(()=>{
        set_entry(challenge?.entry);
        if(auth?.currentUser==null){
            set_state(0); // not logged
            return;
        } 
        const c=user_coins(auth.currentUser?.email,transactions);
        set_coins(c);
        if(c<parseInt(challenge.entry)){
            set_state(1);   
            return ;
        }

        set_state(2);

           
    },[auth,challenge])*/

    useEffect(()=>{
        if(state!=2) return;
        console.log("ok we can make the picks now");
    },[state]);
    return(
        <div className="joinning">
            <div className="top">
                <h2>Joinning</h2>
                <div className="actions">
                    <button onClick={close}><CloseIcon /></button>
                </div>
            </div>

            <div className="body">
                {
                    state==0 && <JoinningAuthAlert />
                }
                {
                    state==1 && <JoinningNotEnougthCoins />
                }

                {
                    state==2 && <div className="processing">
                                <CircularProgress size={20} color="secondary"/>
                                <p>Sending your picks...</p>
                        </div>
                }
                
                
            </div>
            
        </div>
    )
}
export default Joinning;