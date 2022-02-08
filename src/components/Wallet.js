import React, {useState,useEffect} from 'react';
import HeaderBack from "./HeaderBack"
import {makeStyles} from '@material-ui/core/styles';
import { db,auth } from '../firebase_file';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StripeCheckout from 'react-stripe-checkout';
import axios from "axios";
import Transactions from './Transactions';
import MoneyIcon from '@material-ui/icons/Money';
import logo from "./img/logo.png";
import "./wallet.scss";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const Wallet = () => {
   
    const [coins,set_coins]=useState(0);
    const [input,set_input]=useState(0);
    const [dollars,set_dollars]=useState(0);

    useEffect(()=>{
        const email=auth?.currentUser?.email;
        if(email==undefined){
            return;
        }
       
        const unsub=db.collection("psg_users_coins").where("user","==",email).onSnapshot((snap)=>{
            let total_coins=5000;
            snap.docs.map((doc)=>{
                const coins=parseInt(doc.data().entry);
                total_coins+=coins;
                
            })
            set_coins(total_coins);
        });

        return unsub;
    },[]);

    useEffect(()=>{
        if(coins<=0){
            set_dollars(0);
            return;
        }
        let res=coins/1000;
        set_dollars(res);
    },[coins]);
    const [index,set_index]=useState(0);
    const setIndex=(i)=>{
        set_index(i);
    }

    const handle_token=async (token)=>{
       const res=await axios.post("https://psgserver.herokuapp.com/deposite",{token});
      
       const {status}=res.data;
       if(status=="success"){
           alert("ok for deposit");
       }else{
           alert("error for deposit")
       }
       
    }

    const [amount,set_amount]=useState(0);
    useEffect(()=>{
        set_amount(parseFloat(input)*100/1000)
    },[input]);
    return (
        <div className="wallet">
            <HeaderBack 
				title_redux={false}
				show_menu={false} 
				show_empty_div={true}
				title="My Wallet" />
            <div className="wallet_body">
				<div className="top">
					<img src={logo} />
					<p className="total">5000</p>
					<p className="total_label">Total Coins</p>
				</div>
				
				<div className="rewards">
					<p>MY REWARDS</p>
					<button>100 
							<ArrowForwardIosIcon  style={{color:"gray"}} />
					</button>
				</div>
				
				<div className="renew">
					<p>BUY COINS</p>
					
					<div>
						<div>
							<img src={logo} />
							<p>1000</p>
						</div>
						
						<p>$1</p>
					</div>
					
					<div>
						<div>
							<img src={logo} />
							<p>2000</p>
						</div>
						
						<p>$2</p>
					</div>
					
					<div>
						<div>
							<img src={logo} />
							<p>5000</p>
						</div>
						
						<p>$5</p>
					</div>
					
					<div>
						<div>
							<img src={logo} />
							<p>10000</p>
						</div>
						
						<p>$10</p>
					</div>
					
					<div>
						<div>
							<img src={logo} />
							<p>50000</p>
						</div>
						
						<p>$50</p>
					</div>
					
					
				</div>
			
            </div>
            
        </div>
    )
}

export default Wallet

