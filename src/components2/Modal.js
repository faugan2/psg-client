import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {useState} from "react";
export default function SimpleModal({open,content,click,width=60}) {
   
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: width+"%",
  
      backgroundColor: theme.palette.background.paper,
      border: '1px solid silver',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

    const getModalStyle=()=> {
     
      const top = 15 ;
      const left = 25;

      return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
      };
    }

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const handleClose=()=>{
    set_close(!close);
  }

  const [close,set_close]=useState(open);
  
  const body = (
    <div  className={classes.paper}>
      {content}
    </div>
  );

  return (
   
     
      <Modal
        open={close}
        onClose={click}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{border:"1px solid silver",display:"flex",paddingTop:"2rem",justifyContent:"center"}}
      >
        {body}
      </Modal>
    
  );
}