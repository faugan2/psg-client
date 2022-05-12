import "../../styles/joinning.scss";
import {auth,db} from "../../firebase_file";
import CloseIcon from '@material-ui/icons/Close';
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectJoin,selectSelectedPicks} from "../../features/counterSlice";

import JoinningAuthAlert from "../JoinningAuthAlert";


const Joinning=({close})=>{
    const [state,set_state]=useState(0);
    const [entry,set_entry]=useState(0);

    const picks=useSelector(selectSelectedPicks);
    const challenge=useSelector(selectJoin);


    useEffect(()=>{
        console.log("picks=",picks,challenge);
        set_entry(challenge?.entry);
        if(auth?.currentUser==null){
            set_state(0); // not logged
            return;
        }

        if(challenge==null){
            set_state(1) // no challenge selected 
            return;
        }

        if(challenge.number_game!=picks.length){
            set_state(2); // number picks does not match
            return;
        }

        


    },[picks,challenge])
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
                {/*auth?<br />
                picks number?<br /> 
                make picks?<br />
                done making picks?<br />
                entry={entry*/}
            </div>
            
        </div>
    )
}
export default Joinning;