import "../app/globals.css";
import "../app/gov.scss";

const redirectpage = () =>{
    let newPageOpen;
    if (typeof window !== "undefined") {
        const indexOfH = window.location.search.indexOf("h")
        const searchQuery = window.location.search.substring(indexOfH, window.location.search.length)

        newPageOpen = window.open("about:blank", '_blank', searchQuery)
    }

    return(newPageOpen)
}



export default redirectpage