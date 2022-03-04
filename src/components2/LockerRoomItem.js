import "../styles/locker_room_item.scss";
import Line from "./Line";

const LockerRoomItem=({item})=>{
    const line_clicked=()=>{
        //do nothing for the moment 
    }
    console.log(item);
    const {winners,wins,challenge_results}=item;
    console.log("winners=",winners);
    console.log("wins",wins);
    console.log("results",challenge_results);
    return(
        <div className="locker_room_item">
            <Line 
            line={item} 
            click={line_clicked} 
            show_details={true}
            show_btn_join={false}
            show_btn_view={false}
            show_date={true}
            />
        </div>
    )
}
export default LockerRoomItem;