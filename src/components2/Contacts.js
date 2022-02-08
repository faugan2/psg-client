import "../styles/contacts.scss";
import {useEffect, useState} from "react"
import {useSelector,useDispatch} from "react-redux";
import { selectTournaments,selectPicks,selectUsers } from "../features/counterSlice";
import {auth, db} from "../firebase_file";
import Contact from "./Contact";

const Contacts=()=>{
    const t=useSelector(selectTournaments);
    const picks=useSelector(selectPicks);
    const u=useSelector(selectUsers);

    const [contacts,set_contacts]=useState([]);

    const me=auth?.currentUser;

    useEffect(()=>{
        if(picks==null || picks.length==0) return;

        const res=picks.filter((item)=>{
            return item.user==me.email;
        })
        
        const res2=res.map((item)=>{
            return item.id_challenge;
        })
        
        const res3=picks.filter((item)=>{
            return res2.indexOf(item.id_challenge)>=0 && item.user!=me.email;
        })
        
        const res4=res3.map((item)=>{
            return item.user;
        })

        const res5=[];
        for(var i=0; i<res4.length; i++){
            const e=res4[i];
            if(res5.indexOf(e)<0){
                res5.push(e);
            }
        }

        const res6=res5.map((item)=>{
            const user=u.filter((item2)=>{
                return item2.email==item;
            })

            return user[0];
        })
        
        set_contacts(res6);

        
    },[t,picks])

    return(
        <div className="contacts">
            {contacts.length==0 && <div className="info">
                <p>No data found</p>
            </div>
            }

            {
                contacts.length>0 && <div>
                    {
                        contacts.map((item,i)=>{
                            return <Contact key={i} user={item} />
                        })
                    }
                </div>
            }
        </div>
    );
}

export default Contacts;