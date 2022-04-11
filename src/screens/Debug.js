import React,{useEffect, useState} from 'react'
import {db} from "../firebase_file";
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
       /* db.collection("psg_challenges").where("parent","==",false).get().then((snap)=>{
            snap.docs.map((doc)=>{
                const key=doc.id;
                const data=doc.data();
                const date=moment(data.date?.seconds*1000).format("ll");
                if(date=="Mar 4, 2022"){
                    console.log("ok");
                    db.collection("psg_challenges").doc(key).delete();
                }
            })
        })*/
       //create_all_main_challenges(t);

       
    },[t])

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
        db.collection("psg_users").get().then((snap)=>{
            snap.docs.map(async (doc)=>{
                const key=doc.id;
                const coins=doc.data().coins;
                if(coins==5000){
                    await db.collection("psg_users").doc(key).update({coins:"5"},{merge:true});
                }

            })
        })
    },[])
    return (
        <div>
         debug page {status}
        </div>
    )
}
