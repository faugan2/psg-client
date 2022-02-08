import "../styles/contact.scss";

const Contact=({user})=>{
    console.log("we got ",user)
    return (
        <div className="contact">
            <img src={user.photo} />
            <div>
                <p>{user.username}</p>
                <p>{user.status}</p>
            </div>
        </div>
    )
}

export default Contact;