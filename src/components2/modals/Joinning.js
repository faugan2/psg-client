import "../../styles/joinning.scss";
import {auth,db} from "../../firebase_file";
import CloseIcon from '@material-ui/icons/Close';
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectJoin,selectSelectedPicks,selectTransactions,selectGameDate} from "../../features/counterSlice";

import JoinningAuthAlert from "../JoinningAuthAlert";
import {user_coins} from "../data";
import JoinningNotEnougthCoins from "../JoinningNotEnougthCoins";
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from "firebase";
import {set_toast} from "../data";
import { ToastContainer } from 'react-toastify';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
const Joinning=({close})=>{
    const [state,set_state]=useState(0);
    const [entry,set_entry]=useState(0);
    const [coins,set_coins]=useState(0);
    const [success,set_success]=useState(false);
    const [sent,set_sent]=useState(false);

    const picks=useSelector(selectSelectedPicks);
    const challenge=useSelector(selectJoin);
    const transactions=useSelector(selectTransactions);
    const game_date=useSelector(selectGameDate);

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
        //console.log("ok we can make the picks now");
        //console.log(picks);

        let d=game_date._d;
        if(d==undefined){
            d=game_date;
        }

        const obj={
            user:auth?.currentUser?.email,
            picks,
            id_challenge:challenge?.key,
            type_challenge:challenge?.type,
            date:new firebase.firestore.Timestamp.fromDate(d)
        };


        //console.log(obj);

        db.collection("psg_picks").add(obj).then(async ()=>{

      
            let new_entry=0;
            if(challenge?.entry!="0"){
                new_entry=parseInt(challenge?.entry)+0.1;
            }
            const coins_info={
                user:auth?.currentUser?.email,
                id_challenge:challenge?.key,
                picks,
                entry:"-"+new_entry,
                date:firebase.firestore.FieldValue.serverTimestamp()
            };
    
            db.collection("psg_users_coins").add(coins_info).then(()=>{
                set_sent(true);
                set_success(true);
            }).catch((err)=>{
                set_sent(true);
                set_success(false)
            });
            
           
    
        }).catch((err)=>{
            set_sent(true);
            set_success(false)
        })


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
                                {sent==false  && 
                                    <>
                                        <p>Sending your picks...</p>
                                        <CircularProgress size={20} color="secondary"/>
                                    </>
                                
                                }
                                {
                                    sent==true && success==true && 
                                    <>
                                        <CheckCircleOutlineIcon  style={{
                                            fontSize:"3rem",
                                            color:"var(--green)"
                                        }}/>
                                        <p>Sent successfully !!!</p>
                                    </>
                                    
                                }

                                {
                                     sent==true && success==false && 
                                     <>
                                         <ErrorOutlineIcon
                                         style={{
                                            fontSize:"3rem",
                                            color:"indianred"
                                        }}
                                         />
                                         <p>Something wrong happened</p>
                                     </>
                                }
                                
                                
                        </div>
                }
                
                
            </div>

            <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            
        </div>
    )
}
export default Joinning;