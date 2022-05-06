import "../styles/coins_deposite.scss";
import {auth, db} from "../firebase_file";
import {useState,useEffect} from "react";
import GooglePayButton from "@google-pay/button-react";

const CoinsDeposite=({transactions})=>{
    const [total,set_total]=useState(50);
    const [amount,set_amount]=useState(10)

    useEffect(()=>{
        
        if(auth?.currentUser==null) return;
        console.log("hi");
        if(transactions==undefined || transactions==null || transactions.length==0) return;
        const email=auth?.currentUser?.email;
        const res=transactions.filter((item)=>{
            return item.user==email;
        })


        let t=50;
        console.log("the total is ",t);
        res.map((item)=>{
            const el=parseFloat(item.entry);
            if(isNaN(el)){
                el=0;
            };
            t+=el;
        })
        
        set_total(t);
        
    },[auth]);
    return(
        <div className="coins_deposite">
            <div className="top">
                <button>
                    {total}
                </button>
                <p>Total Coins</p>
            </div>
            <div className="content">
                {/*<button>MAKE A DEPOSITE</button>
                <p>Or</p>
                <button disabled >MAKE A WITHDRAWAL</button>*/}

                <div className="line">
                    <p>Input the amount you want to charge</p>
                    <input type="tel" placeholder="10" value={amount}
                    onChange={e=>set_amount(e.target.value)}
                    />
                </div>


                <GooglePayButton
                    environment="TEST"
                    buttonColor="white"
                    buttonLocale="en"
                    buttonType="plain"
                    paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                        {
                            type: 'CARD',
                            parameters: {
                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                            allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "MIR", "VISA"],
                            },
                            tokenizationSpecification: {
                            type: 'PAYMENT_GATEWAY',
                            parameters: {
                                gateway: 'example',
                                gatewayMerchantId: 'exampleGatewayMerchantId',
                            },
                            },
                        },
                        ],
                        merchantInfo: {
                        merchantId: '9191-3325-0049',
                        merchantName: 'ProSport.Guru Inc.',
                        },
                        transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: `${amount}`,
                        currencyCode: 'USD'
                        },
                    }}
                    onLoadPaymentData={paymentRequest => {
                        console.log('load payment data', paymentRequest);
                    }}
                    />

                    <div className="info">
                        <p>$1 = 1000 coins</p>
                    </div>


            </div>
        </div>
    )
}
export default CoinsDeposite;