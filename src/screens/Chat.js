import "../styles/chat.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from "react-router-dom";
import NearMeIcon from '@material-ui/icons/NearMe';
import {useState,useEffect,useRef} from "react";
import {auth, db} from "../firebase_file";
import firebase from "firebase";
import {useSelector,useDispatch} from "react-redux";
import {selectChat,setChatRead,selectChatTotal,selectChatRead,setChat} from "../features/counterSlice";
import ChatLine from "../components2/ChatLine";

const moment=require("moment-timezone");

const Chat=()=>{
    const history=useHistory();
    const dispatch=useDispatch();

    const global_chats=useSelector(selectChat)
    const chat_total=useSelector(selectChatTotal);
    const chat_read=useSelector(selectChatRead);
    

    const [message,set_message]=useState("");
    const [data,set_data]=useState([])

    const ref=useRef(null);
    const ref_btn=useRef(null);

  

    useEffect(()=>{
        dispatch(setChatRead(chat_total));
    },[chat_total,chat_read])

    useEffect(()=>{
        if(global_chats==null) return;
        const all_dates=[];
        global_chats.map((item)=>{
            const date=moment(item.date?.seconds*1000).format("ll");
            if(all_dates.indexOf(date)<0){
                all_dates.push(date);
            }
            
        })

        const all_chats=[];
        all_dates.map((date)=>{
            const res=global_chats.filter((item)=>{
                const chat_date=moment(new Date(item?.date?.seconds*1000)).format("ll");
                return date==chat_date;
            })
            
            all_chats.push({date,chats:res})
            
            
        })
        
        set_data(all_chats);
        dispatch(setChatRead(all_chats.length));
        
        const bottom=document.querySelector("#chat_bottom");
        bottom.scrollIntoView();
        

    },[global_chats])

    useEffect(()=>{
        if(data.length>0){
            const bottom=document.querySelector("#chat_bottom");
            bottom.scrollIntoView();
        }
    },[data])


    const input_focus=()=>{
        
        const bottom=document.querySelector("#chat_bottom");
        bottom.scrollIntoView(); 
    }
   
    const send_message=()=>{
       if(message=="") return;
        const line={
            user:auth?.currentUser?.email,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            message
        }
        ref_btn.current.disabled=true;
        set_message("");
        ref.current.focus();
        const seconds=new Date().getTime()/1000;
        
        const new_line={
            ...line,
            date:{seconds}
        }
        
        let new_data;
        if(global_chats!=undefined){
            new_data=[...global_chats,new_line];
        }else{
            new_data=[new_line]
        }

        //console.log(new_data,global_chats)
        dispatch(setChat(new_data));
       
        /*set_data(new_data);*/
       // ref_btn.current.disabled=false;

        db.collection("psg_chat").add(line).then(()=>{
            ref_btn.current.disabled=false;
        }).catch((err)=>{
            ref_btn.current.disabled=false;
        })
    }

    function hashCode(str) { 
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } 

    function intToRGB(i){
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
    
        return "00000".substring(0, 6 - c.length) + c;
    }

    return(
        <div className="chat">
           <div className="top">
               <button onClick={e=>{
                    history.goBack();
                }}>
                   <ArrowBackIcon />
               </button>
               <h2>Discussion</h2>
           </div>
           <div className="content">
               {/*chat content will be here */}
               {
                   data.length>0 && <div className="chats">
                            {
                                data.map((item)=>{
                                   
                                   const {date,chats}=item;
                                   if(date=="Invalid date") return null;
                                  
                                   return (
                                       <div className="chat_of_date">
                                           <p>{date}</p>
                                           {
                                               chats.map((chat)=>{
                                                   return (
                                                    <ChatLine chat={chat} key={chat.key} 
                                                    color={hashCode}
                                                    intToRGB={intToRGB} 
                                                />
                                                   )
                                               })
                                           }
                                       </div>
                                   )
                                   
                                
                                })
                            }

                            
                       </div>
               }
               <div className="chats_bottom" id="chat_bottom"></div>
           </div>
           <div className="chat_footer">
               <div className="line">
                   <textarea type="text" placeholder="type your message"
                   value={message}
                   onChange={e=>{
                       set_message(e.target.value)
                       if(e.target.value==""){
                            ref_btn.current.style.backgroundColor="rgba(0,0,0,0.2)"
                           ref_btn.current.style.color="silver"
                       }else{
                           //console.log("not null");
                           ref_btn.current.style.backgroundColor="whitesmoke"
                           ref_btn.current.style.color="indianred"
                       }
                    }
                    }
                   ref={ref}
                   onFocus={input_focus}
                   />
                   <button onClick={send_message} ref={ref_btn}>
                       <NearMeIcon style={{fontSize:"1.2rem"}}/>
                   </button>
               </div>
           </div>
        </div>
    );

}

export default Chat;