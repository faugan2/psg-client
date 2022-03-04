import "../styles/league.scss";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {baseball,basketball,hockey,football} from "../components2/data";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ForumIcon from '@material-ui/icons/Forum';
const League=({league,click,go_to_invites,go_to_messages})=>{
    const name=league.name;
    const id=league.id;
    return (
        <button className="league" onClick={click}>
           {id=="6" && <img src={baseball} />}
           {id=="2" && <img src={basketball} />}
           {id=="1" && <img src={football} />}
           {id=="3" && <img src={hockey} />}
           <p>{name}</p>
           <div>
               <ArrowForwardIcon />
           </div>

           <section className="bottom">
              <button onClick={go_to_invites}>
                  <PersonAddIcon style={{fontSize:"1rem",color:"gray"}} />
                  Invites(0)
              </button>
              <button onClick={go_to_messages}>
                  <ForumIcon style={{fontSize:"1rem",color:"gray"}} />
                  Messages(0)
              </button>
           </section>
        </button>
    )
}

export default League;