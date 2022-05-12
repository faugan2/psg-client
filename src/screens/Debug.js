import React,{useEffect, useState} from 'react'
import {db,auth} from "../firebase_file";
import {create_all_main_challenges} from "../components2/data";

import {useSelector,useDispatch} from "react-redux";
import {selectTournaments} from "../features/counterSlice";


const moment=require("moment-timezone");
export default function Debug(props) {
    const [status,set_status]=useState("processing");
    const t=useSelector(selectTournaments);
    
    /*useEffect(()=>{
        db.collection("psg_challenges").where("parent","==",false).get().then((snap)=>{
            snap.docs.map(async (doc)=>{
                const key=doc.id;
                if(doc.data().winners==undefined) return;
                const res=doc.data().challenge_results[0].results;

               const vide=res.filter((item)=>{
                   return item=="";
               })

              if(vide.length==res.length){
                  const obj={...doc.data()};
                  delete obj.challenge_results;
                  delete obj.winners;
                  delete obj.wins;
                  db.collection("psg_challenges").doc(key).set(obj);
                  
              }
            })
        })
    },[])*/

    useEffect(()=>{
       db.collection("psg_challenges").where("parent","==",false).get().then((snap)=>{
            snap.docs.map((doc)=>{
                const key=doc.id;
                db.collection("psg_challenges").doc(key).delete();
                
            })
        })
       //create_all_main_challenges(t);

       
    },[])

    useEffect(()=>{
       /* console.log("getting...");
        db.collection("psg_challenges").get().then((snap)=>{
            snap.docs.map((doc, i)=>{
                const id=doc.id;
                console.log(i,"id=",id);
            })
        })*/
    },[])

    useEffect(()=>{
        /*db.collection("psg_users").get().then((snap)=>{
            snap.docs.map(async (doc)=>{
                const key=doc.id;
                const coins=doc.data().coins;
                if(coins==5000){
                    await db.collection("psg_users").doc(key).update({coins:"5"},{merge:true});
                }

            })
        })*/
    },[])

    useEffect(()=>{
        /*db.collection("psg_challenges").where("parent","==",true).get().then((snap)=>{
            snap.docs.map((doc)=>{
                const key=doc.id;
                let entry=parseInt(doc.data().entry);
                if(entry>=1000){
                    entry/=1000;
                }
                db.collection("psg_challenges").doc(key).update({entry},{merge:true});
                
            })
        })*/
    },[])

    useEffect(()=>{
        auth.signOut();
    },[])
    return (
        <div>
         debug page {status}
        </div>
    )
}
