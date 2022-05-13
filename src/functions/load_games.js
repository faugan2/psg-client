import {db} from "../firebase_file";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import {setTodayTime,setGames} from "../features/counterSlice";
import {get_today_time} from "../functions";


const load_games=async ()=>{
   
    let today_time=await get_today_time();
    db
    .collection("psg_games")
    .orderBy("time","desc")
    .onSnapshot(async (snap)=>{
        const g=[];
        
       //dispatch(setTodayTime(today_time));
        ////console.log("we load ",today_time)
        snap.docs.map((doc)=>{
            const id=doc.id; 
            const data=doc.data();
            data.key=id;
            const date=data.date?.seconds;
            const time=data.time;
            data.rdx_time=today_time;
            const diff=time-today_time;
           
            data.diff=diff;
            const heur=diff*0.00000027777777777778
            ////console.log("reading from data ",data);
            data.heur=heur.toFixed(2);

            let start_date=new Date(time).toUTCString();
            let today_date=new Date(today_time).toUTCString();
            
            start_date=start_date.split(",");
            start_date=start_date[1];

            today_date=today_date.split(",");
            today_date=today_date[1];

            start_date=start_date.trim();
            if(today_date!=undefined){
                today_date=today_date?.trim();

                start_date=start_date.split(" ");
                today_date=today_date?.split(" ");

                start_date=start_date[0]+" "+start_date[1]+" "+start_date[2];
                today_date=today_date[0]+" "+today_date[1]+" "+today_date[2];
                

                if(start_date==today_date){
                   // data.today=true;
                   ////console.log("comp of diff=",diff);
                   ////console.log("comp of data=",data);
                    if(diff>=0){
                        ////console.log("comp of >0",start_date,today_date,diff,heur);
                        data.date=date;
                        data.key=id;
                        data.started=false;
                        data.today=true;
                    }else{
                        data.started=true;
                        ////console.log("comp of<0",start_date,today_date,diff,heur);
                        
                    }
                    
                }else{
                    data.today=false;
                    data.started=false;
                }
                g.push(data);
            }
            
         
        })
       return g;
      //  dispatch(setGames(g));
        ////console.log("comp of dispatch",g);
    })


   }

   export {load_games};