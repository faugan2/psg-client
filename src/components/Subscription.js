import React,{useState,useEffect} from 'react'
import HeaderBack from './HeaderBack'
import { useDispatch, useSelector } from 'react-redux'
import { selectPicksBought } from '../features/counterSlice'
import { auth, db } from '../firebase_file'
import "./subscription.scss";
const Subscription=()=>{
	return (
		<div className="subscription">
			<HeaderBack 
				title_redux={false} 
				title="Premium" 
				show_menu={false} 
				show_empty_div={true}
				/>
				<div className="subscription_body">
					<div className="top">
						<h1>Upgrade to Premium</h1>
						<p>Private profile, prive history and many more!</p>
					</div>
					
					<div className="options">
						<button>
							<h1>1</h1>
							<p>Month</p>
							<h4>$10.00/mt</h4>
						</button>
						
						<button>
							<h1>12</h1>
							<p>Months</p>
							<h4>$100.00/mt</h4>
						</button>
					</div>
					
					<div className="submit_zone">
						<button>Submit</button>
					</div>
					
					<div className="faq">
						<h3>When will i be billed?</h3>
						<p>
							Your prosport guru account will be billed on confirmation of your subscription.
						</p>
					</div>
					
					<div className="faq">
						<h3>Does my subscription auto renew?</h3>
						<p>No, but you will be notified couple days before your subscription takes end.</p>
					</div>
					
					
				</div>
			
		</div>
	)
}

export default Subscription;
