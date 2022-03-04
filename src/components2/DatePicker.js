import "../styles/date_picker.scss";
import DatePicker from "react-horizontal-datepicker";
import {useSelector,useDispatch} from "react-redux";
import {selectGameDate,selectLeaguePageOptions,setLeaguePageOptions} from "../features/counterSlice";
import {useState,useEffect} from "react";

const Picker=({selectedDay})=>{
    
    const league_page_options=useSelector(selectLeaguePageOptions);
    const new_date=useSelector(selectGameDate);

    const dispatch=useDispatch();

    const [d,set_d]=useState("");

    useEffect(()=>{
        let d2=new_date._d;
        if(d2==undefined){
            d2=new_date;
        }
        const new_league_options={...league_page_options,date:[d2]};
        dispatch(setLeaguePageOptions(new_league_options));

    },[new_date])

    


    

    return (
        <div className="date_picker">
            <DatePicker getSelectedDay={selectedDay}
                    endDate={50}
                    selectDate={d}
                    labelFormat={"MMM yyyy"}
                    color={"indianred"}  
                           
                />
        </div>
    )
}
export default Picker;