import React from 'react'

export default function Challengefriendprevnextbtns(props) {
    const {btnPrev,btnNext,handle_next,handle_prev,btnCreate,handle_create}=props;

    return (
        <div style={{
            display:"flex",
            padding:"1rem",
            width:"80%",
            margin:"auto",
            marginTop:"1rem",
            gap:"1rem",
            justifyContent:"center",
            
        }}>
            {btnPrev==true && <button style={{
                width:"100px",
                padding:"0.6rem",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                border:"none",
                fontWeight:"bold",
                backgroundColor:"white",
                border:"1px solid silver",
                fontSize:"0.8rem",
                borderRadius:"5px",
            }}
            onClick={handle_prev}
            >Prev.</button>}
           
           {btnNext==true && <button
            style={{
                width:"100px",
                padding:"0.6rem",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                
                fontWeight:"bold",
                fontSize:"0.8rem",
                borderRadius:"5px",
                border:"1px solid indianred",
                backgroundColor:"white",
                color:"indianred",
            }}

            onClick={handle_next}
            >Next</button>
        }

        {btnCreate==true &&<button style={{
                            
                            width:"100px",
                            padding:"0.6rem",
                     display:"flex",
                justifyContent:"center",
                alignItems:"center",
                border:"none",
                fontWeight:"bold",
                fontSize:"0.8rem",
                borderRadius:"5px",
                border:"1px solid indianred",
                backgroundColor:"white",
                color:"indianred",

                        }}
                        onClick={handle_create}
                        >Create</button>
                    }
        </div>
    )
}
