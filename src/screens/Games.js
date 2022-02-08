import "../styles/games.scss"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HomeIcon from '@material-ui/icons/Home';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import HistoryIcon from '@material-ui/icons/History';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ForumIcon from '@material-ui/icons/Forum';
import {useHistory} from "react-router-dom";
import {selectSport, setGameDate} from "../features/counterSlice";
import {useSelector,useDispatch} from "react-redux";
import {useEffect, useState,useRef} from "react";
import {baseball,basketball,hockey,football} from "../components/data";
import GameListe from "../components2/GameListe";
import Live from "../components2/Live";
import History from "../components2/History";
import Contacts from "../components2/Contacts";
import Chat from "../components2/Chat"
const Games=()=>{
    const [sport,set_sport]=useState(null);
    const [page,set_page]=useState(1);

    const history=useHistory();
    const dispatch=useDispatch();
    const s=useSelector(selectSport);
    

    useEffect(()=>{
        if(s==null){
            history.replace("/");
            return;
        }
        set_sport(s);
    },[s]);

    const go_back=()=>{
        history.goBack();
    }

    useEffect(()=>{
        dispatch(setGameDate(new Date()))
    },[])

    const change_page=(index)=>{
        const btns=document.querySelectorAll(".games_btn");
        for(var i=0; i<btns.length; i++){
            const btn=btns[i];
            btn.classList.remove("active");
        }
        btns[index-1].classList.add("active");
        set_page(index);
    }
    return(
        <div className="games">
            <div className="head">
                <div>
                    <button onClick={go_back}>
                        <ArrowBackIcon />
                    </button>
                    {sport?.id=="2" && <img src={basketball} />}
                    {sport?.id=="6" && <img src={baseball} />}
                    {sport?.id=="1" && <img src={football} />}
                    {sport?.id=="3" && <img src={hockey} />}
                    <h2>{sport?.name}</h2>
                </div>
                <div>
                   
                </div>
                
            </div>
            <div className="body">
                {page==1 && <GameListe />}
                {page==2 && <Live />}
                {page==3 && <History />}
                {page==4 && <Contacts />}
                {page==5 && <Chat />}
            </div>
            <div className="games_footer">
                <div className="menu">
                    <button className="games_btn active" onClick={change_page.bind(this,1)}>
                        <HomeIcon style={{color:"gray",fontSize:"1.2rem"}} />
                        Home
                    </button>
                    <button className="games_btn" onClick={change_page.bind(this,2)}>
                        <LiveTvIcon style={{color:"gray",fontSize:"1.2rem"}} />
                        Live
                    </button>
                    <button  className="games_btn"  onClick={change_page.bind(this,3)}>
                        <HistoryIcon style={{color:"gray",fontSize:"1.2rem"}} />
                        History
                    </button>
                    <button  className="games_btn" onClick={change_page.bind(this,4)}>
                        <PermContactCalendarIcon style={{color:"gray",fontSize:"1.2rem"}} />
                        Contacts
                    </button>
                    <button  className="games_btn" onClick={change_page.bind(this,5)}>
                        <ForumIcon style={{color:"gray",fontSize:"1.2rem"}} />
                        Chat
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default Games;