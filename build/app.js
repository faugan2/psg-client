if("serviceWorker" in navigator){
    navigator.serviceWorker.register("/sw.js")
    .then(()=>{
        //console.log("Service worker  is registered");
    }).catch((er)=>{
        //console.log("service worked not registred");
    })
}