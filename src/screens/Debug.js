import React,{useEffect, useState} from 'react'
import {db} from "../firebase_file";
export default function Debug(props) {
    const [status,set_status]=useState("processing");
    
    useEffect(()=>{
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
    },[])

    return (
        <div>
         debug page {status}
        </div>
    )
}
