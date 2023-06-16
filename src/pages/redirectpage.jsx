import "../app/globals.css";
import "../app/gov.scss";
import * as querystring from "querystring";

const redirectpage = () =>{
    const urlParams = new URLSearchParams(querystring)
    const redirectLink = urlParams.get("redirecturl")
    let newPageOpen;
    if (typeof window !== "undefined") {
        newPageOpen = window.open(redirectLink, "_blank")
    }

    return(newPageOpen)
}



export default redirectpage