import {db} from "./firebase_file";
import firebase from "firebase";
import moment from "moment-timezone";
import { useEffect } from "react";

const Debug=()=>{
    useEffect(()=>{
       db.collection("psg_challenges").where("challenged","==",true).get().then((snap)=>{
           console.log("we get all ",snap.docs.length);
           snap.docs.map(async (doc)=>{
            const key=doc.id;
            console.log("delete ",key);
            await db.collection("psg_challenges").doc(key).delete();
            console.log("deleting picks of ",key);
            const picks=await db.collection("psg_picks").where("id_challenge","==",key).get();
            picks.docs.map(async (pick)=>{
                const pick_id=pick.id;
                await db.collection("psg_picks").doc(pick_id).delete();
            })
            
           });
           
       });
    },[]);
    return(
        <div>
            I am the script page
        </div>
    );
}

export default Debug;