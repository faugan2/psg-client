import "../styles/contact.scss";

const Contact=({user,click})=>{
    //console.log("we got ",user)
    return (
        <div className="contact" onClick={click.bind(this,user)}>
            <img src={user.photo} />
            <div>
                <p>{user.username}</p>
                <p>{user.status}</p>
            </div>
        </div>
    )
}

export default Contact;