import React,{useState,useEffect} from 'react'
import HeaderBack from './HeaderBack'
import { useDispatch, useSelector } from 'react-redux'
import { selectPicksBought } from '../features/counterSlice'
import { auth, db } from '../firebase_file'
import "./subscription.scss";
const Terms=()=>{
	return (
		<div className="subscription">
			<HeaderBack 
				
				title="Terms of use and privacy policy" 
				title_redux={false} 
				show_menu={false} 
				show_empty_div={true}
				/>
				<div className="subscription_body">
					
					
					
				</div>
			
		</div>
	)
}

export default Terms;
