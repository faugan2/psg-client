import "../styles/date_picker.scss";
import DatePicker from "react-horizontal-datepicker";
import {useSelector} from "react-redux";
import {selectGameDate} from "../features/counterSlice";

const Picker=({selectedDay,date})=>{
    
    const new_date=useSelector(selectGameDate);

    return (
        <div className="date_picker">
            <DatePicker getSelectedDay={selectedDay}
                    endDate={50}
                    selectDate={new_date._d}
                    labelFormat={"MMM yyyy"}
                    color={"indianred"}  
                           
                />
        </div>
    )
}
export default Picker;