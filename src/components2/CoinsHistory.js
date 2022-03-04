import "../styles/coins_history.scss";
import {auth, db} from "../firebase_file";
import {useState,useEffect} from "react";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const moment=require("moment-timezone");

const CoinsEarnings=({transactions,tournaments})=>{

    const [earnings,set_earnings]=useState([]);

    useEffect(()=>{
        if(auth?.currentUser==null) return;
        if(transactions==undefined || transactions==null || transactions.length==0) return;
        const email=auth?.currentUser?.email;
        const res=transactions.filter((item)=>{
            const entry=parseFloat(item.entry);
            if(isNaN(entry)) return false;
            if(entry>=0) return false;

            return item.user==email;
        })
       

        const res2=res.map((item)=>{
            const id_challenge=item.id_challenge;
            const challenge=tournaments.filter((ch)=>{
                return ch.key==id_challenge;
            })
            if(challenge.length){
                const obj={...item,challenge:challenge[0]};
                return obj;
            }
        }).filter((item)=>{
            return item!=undefined;
        })

        const deja=[];
       
        const dates=res2.map((item)=>{
            const date=moment(item.date?.seconds*1000).format("ll");
            if(deja.indexOf(date)>=0){
                return undefined;
            }
            deja.push(date);
            return date;
        }).filter((item)=>{
            return item!=undefined;
        })

       



        const res3=[];
        for(var i=0; i<dates.length; i++){
            const date=dates[i];
            const el=[];
            res2.map((item)=>{
                const item_date=moment(item.date?.seconds*1000).format("ll");
                if(date==item_date){
                    el.push(item);
                }
            })
            res3.push({date,lines:el});
        }
        
        set_earnings(res3)
        
        
    },[auth,transactions]);


    return(
        <div className="coins_history">
           {earnings.length==0 &&  <div className="info">
                <p>No data found</p>
            </div>
            }

            {
                earnings.length>0 && 
                <div className="content">
                    {
                        earnings.map((item,i)=>{
                            const {date,lines}=item;
                            return(
                                <div key={i}>
                                    <p>{date}</p>
                                    {lines.map((line)=>{
                                       return(
                                           <div key={line.key} className="line">
                                               <p>{line.entry} coins</p>
                                                <button>
                                                    <ArrowForwardIosIcon style={{fontSize:"1rem"}}/>
                                                </button>
                                            </div>
                                       )
                                    })}
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}
export default CoinsEarnings;