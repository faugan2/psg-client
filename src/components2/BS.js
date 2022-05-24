import React from 'react';
import "../styles/bs.scss";

export default function Example({content,close,open,index}) {
  
  const r=Math.round(Math.random()*1000);
  

  const content_clicked=(e)=>{
    e.stopPropagation();
  }

  const overlay_clicked=(e)=>{
    close();
  }

  return (
    <div className="bs">
    <div id={`bottom-sheet-${r}`} className={`overlay ${open}`} onClick={overlay_clicked}>
      <aside className="social" 
      onClick={content_clicked}
      tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">
           {content}
      </aside>
      <a href="#close" className="btn-close" aria-hidden="true">
        <span className="mdi mdi-close"></span>
        <span className="sr-only">Close</span>
      </a>
    </div>
  </div>
  );
}