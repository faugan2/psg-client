import "../styles/chat_line.scss";
import {auth} from "../firebase_file";
import {useSelector,useDispatch} from "react-redux";
import {selectUsers} from "../features/counterSlice";
import {useState,useEffect} from "react";
import {useTransition,animated} from "react-spring";

const moment=require("moment-timezone");

const ChatLine=({chat,color,intToRGB})=>{
    const users=useSelector(selectUsers);

    const {date,message,user}=chat;

    const [data,set_data]=useState(null);
    const [user_color,set_user_color]=useState(null);
    const [chat_date,set_chat_date]=useState("");

    useEffect(()=>{
        set_chat_date(moment(date?.seconds*1000).format("LT"));
    },[date])
    //const chat_date=moment(date?.seconds*1000);

    

    useEffect(()=>{
        if(users==null) return;
        const res=users.filter((item)=>{
            return item.email==user;
        });

        if(res.length>0){
            set_data(res[0]);
            set_user_color(intToRGB(color(res[0].email)))
        }
    },[users])
   
    const [show_chat,set_show_chat]=useState([1]);
    const transition=useTransition(show_chat,{
        from:{x:0,y:30,opacity:0},
        enter:item => async (next)=>{
            await next({x:0,y:0,opacity:1,delay:100});
            
        },
        leave:{}
    })
    return(
        transition((style,item)=>{
            if(item){
                return(
                    <animated.div className="chat_line" style={style}>
                    
                        {
                            data?.email==auth?.currentUser?.email ?
                            <div className="me">
                                <div>
                                    <p>{message}</p>
                                    <p> {chat_date}</p>
                                </div>
                            </div>:
                            <div className="other">
                                <div>
                                    <img src={data?.photo} />
                                    <div>
                                        <div>
                                            <p style={{
                                                color:`#${user_color}`
                                            }}>{data?.username}:<span>{message}</span></p>
                                            
                                        </div>
                                        <p>{chat_date}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </animated.div>
                );
            }
        })
        
    )
}

export default ChatLine;