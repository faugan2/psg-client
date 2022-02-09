import "../styles/date_picker.scss";
import DatePicker from "react-horizontal-datepicker";

const Picker=({selectedDay,date})=>{
    
    return (
        <div className="date_picker">
            <DatePicker getSelectedDay={selectedDay}
                    endDate={50}
                    selectDate={date}
                    labelFormat={"MMM yyyy"}
                    color={"indianred"}  
                           
                />
        </div>
    )
}
export default Picker;