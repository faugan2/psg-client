import "../styles/main_footer.scss";
import TimelineIcon from '@material-ui/icons/Timeline';
import HomeIcon from '@material-ui/icons/Home';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import HistoryIcon from '@material-ui/icons/History';
import {useState,useEffect} from "react";

const MainFooter=({click,page})=>{
   
    return(
        <div className="main_footer">
           <div className="menu">
            <button className={page==1?"active":""} onClick={click.bind(this,1)}>
                <HomeIcon style={{color:"gray",fontSize:"1.2rem"}} />
                Home
            </button>
            <button className={page==2?"active":""}onClick={click.bind(this,2)}>
                <LiveTvIcon style={{color:"gray",fontSize:"1.2rem"}} />
                Live
            </button>
            <button  className={page==3?"active":""} onClick={click.bind(this,3)}>
                <HistoryIcon style={{color:"gray",fontSize:"1.2rem"}} />
                History
            </button>

            <button  className={page==4?"active":""} onClick={click.bind(this,4)}>
                <TimelineIcon style={{color:"gray",fontSize:"1.2rem"}} />
                Locker Room
            </button>

           

            {/*<button  className="games_btn" onClick={change_page.bind(this,5)}>
                <PermContactCalendarIcon style={{color:"gray",fontSize:"1.2rem"}} />
                Contacts
            </button>*/}
            
            
        </div>
        </div>
    );
}

export default MainFooter;