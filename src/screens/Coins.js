import "../styles/coins.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from "react-router-dom";
import RefreshIcon from '@material-ui/icons/Refresh';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TimelineIcon from '@material-ui/icons/Timeline';
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectTransactions,selectTournaments} from "../features/counterSlice";
import {auth, db} from "../firebase_file";
import CoinsDeposite from "../components2/CoinsDeposite";
import CoinsEarnings from "../components2/CoinsEarnings";
import CoinsHistory from "../components2/CoinsHistory"
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
const Coins=()=>{
    const history=useHistory();
    const transactions=useSelector(selectTransactions);
    const tournaments=useSelector(selectTournaments);
    
    const [page,set_page]=useState(0);
   
    useEffect(()=>{
        const btns=document.querySelectorAll(".coins_footer>button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        btns[page].classList.add("active");
    },[page])

    const set_page_index=(index)=>{
        set_page(index);
    }


    return(
        <div className="coins">
            <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <h2>Coins Transactions</h2>
            </div>
            <div className="content">
                {page==0 && <CoinsDeposite 
                    transactions={transactions} 
                    tournaments={tournaments} 
                    />}
                {page==1 && <CoinsEarnings 
                    transactions={transactions} 
                    tournaments={tournaments} 
                />}
                {page==2 && <CoinsHistory 
                    transactions={transactions} 
                    tournaments={tournaments} 
                />}
            </div>

            <div className="coins_footer">
                <button  onClick={set_page_index.bind(this,0)}>
                    <RefreshIcon style={{fontSize:"1.2rem"}}/>
                    Deposite
                </button>
                <button onClick={set_page_index.bind(this,1)}>
                    <AttachMoneyIcon style={{fontSize:"1.2rem"}}/>
                    Earnings
                </button>
                <button onClick={set_page_index.bind(this,2)}>
                    <TrendingDownIcon style={{fontSize:"1.2rem"}}/>
                    Outs
                </button>
            </div>
        </div>
    );
}
export default Coins;