import "../styles/create_challenge_date.scss";
import DatePicker from "./DatePicker";
import {useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { selectCreateChallengeOptions,setCreateChallengeOptions ,selectTimeZone} from "../features/counterSlice";
import CloseIcon from '@material-ui/icons/Close';

const moment=require("moment-timezone");
const CreateChallengeDate=()=>{
    
    const dispatch=useDispatch();
    const options=useSelector(selectCreateChallengeOptions);
    const tz=useSelector(selectTimeZone);

    const [type,set_type]=useState(1);
    const [dates,set_dates]=useState([]);

    const selectedDay=(val)=>{
        if(type==1){
            const res=moment.tz(val,tz).format("ll");
            set_dates([res]);
            dispatch(setCreateChallengeOptions({...options,date:[res]}))
            return;
        }
        var old_date=options.date;
        const new_date=[];
        const deja=[];
        for(var i=0; i<old_date.length; i++){
            const date=old_date[i];
            const str_day=moment.tz(date,tz).format("ll");
            new_date.push(str_day);
        }

        const str_val=moment.tz(val,tz).format("ll");
        if(new_date.indexOf(str_val)<0){
            new_date.push(str_val);
        }
       
        set_dates(new_date);
        dispatch(setCreateChallengeOptions({...options,date:new_date}))
    }

    useEffect(()=>{
        const inputs=document.querySelectorAll(".line_date input");
        inputs[type-1].click();
        if(type==1){
            dispatch(setCreateChallengeOptions({...options,single:true}))
        }else{
            dispatch(setCreateChallengeOptions({...options,single:false}))
        }
    },[type]);

    const set_type_change=(id)=>{
        set_type(id);
        if(id==1){
            const old_dates=options.date;
            if(old_dates.length>0){
                const new_date=old_dates[0];
                set_dates([new_date]);
                dispatch(setCreateChallengeOptions({...options,date:[new_date]}))

            }
        }
    }
    const remove_date=(date)=>{
        const old_date=options.date;
        const res=old_date.filter((item)=>{
            return item!=date;
        })

        set_dates(res);
        dispatch(setCreateChallengeOptions({...options,date:res}))
    }
    return(
        <div className="create_challenge_date">
            <div className="line line_date">
                <button onClick={e=>set_type_change(1)}>
                    <input type="radio" name="date_option" defaultChecked /> Single Date
                </button>
                <button onClick={e=>set_type_change(2)}>
                    <input type="radio" name="date_option" /> Multiple Dates
                </button>
            </div>
            <DatePicker selectedDay={selectedDay} />
            <div className="line_selected_dates">
                {/*selected dates are here*/}
                
                   
                        <div className="dates">
                            {
                                dates.map((item,i)=>{
                                    return(
                                        <div key={i} className="date">
                                            <p>{item}</p>
                                            <button onClick={remove_date.bind(this,item)}>
                                                <CloseIcon style={{fontSize:"1.2rem",color:"white"}} />
                                            </button>
                                        </div>
                                    );
                                })
                            }
                        </div>
                
            </div>
        </div>
    )
}
export default CreateChallengeDate;