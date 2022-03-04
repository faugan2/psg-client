import "../styles/header_bottom_sheet.scss";

const HeaderBottomSheet=(props)=>{
    return(
        <div className="header_bottom_sheet">
            <h2>{props.title}</h2>
            {props.children}
        </div>
    )
}

export default HeaderBottomSheet;