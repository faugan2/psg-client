import {db} from "./firebase_file";
import firebase from "firebase";
import moment from "moment-timezone";
import { useEffect } from "react";

const Debug=()=>{
    useEffect(()=>{
      db.collection("psg_challenges").where("parent","!=",true).get().then((snap)=>{
          snap.docs.map(async (doc,i)=>{
              const key=doc.id;
             await db.collection("psg_challenges").doc(key).delete();
          })
      })
    },[]);
    return(
        <div>
            I am the script page
        </div>
    );
}

export default Debug;